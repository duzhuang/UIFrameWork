import UIAnimationComponent from "../component/UIAnimationComponent";
import { UIAnimationTypeMap } from "../config/UICustomAnimationConfig";
import { EasingTypeMap } from "../config/UIEasingTypes";
import { IResourceLoader } from "./interfaces/IResourceLoader";
import { IUIAnimationRegistry } from "./interfaces/IUIAnimationRegistry";
import { IUICachePool } from "./interfaces/IUICachePool";
import { IUILayerManager } from "./interfaces/IUILayerManager";
import { IUIManager } from "./interfaces/IUIManager";
import { UIAnimationOptions } from "./interfaces/UIAnimationOptions";
import { UIManagerInitOptions } from "./interfaces/UIManagerInitOptions";
import { UIOptions } from "./interfaces/UIOptions";

export class UIManager implements IUIManager {

    private static m_instance: UIManager = null;

    private m_layerManager: IUILayerManager = null;
    private m_cachePool: IUICachePool = null;
    private m_animationRegistry: IUIAnimationRegistry = null;
    private m_resourceLoader: IResourceLoader = null;

    /** 保存已打开的 uiName → 节点 */
    private m_uiOpenedMap: Map<string, cc.Node> = new Map();
    /** 保存已打开的 uiName → UIOptions */
    private m_optionsMap: Map<string, UIOptions> = new Map();
    /** 正在打开 */
    private m_openingLocks: Map<string, Promise<cc.Node>> = new Map<string, Promise<cc.Node>>();
    /** 正在关闭 */
    private m_closingLocks: Map<string, Promise<void>> = new Map<string, Promise<void>>();


    private constructor() { }
    /**
     * 获取 UIManager 实例
     */
    public static get instance(): UIManager {
        if (this.m_instance === null) {
            this.m_instance = new UIManager();
        }
        return this.m_instance;
    }

    init(options: UIManagerInitOptions): void {
        this.m_layerManager = options.layerManager;
        this.m_cachePool = options.cachePool;
        this.m_animationRegistry = options.animationRegistry;
        this.m_resourceLoader = options.resourceLoader;
    }

    destroy(): void {
        this.m_layerManager = null;
        this.m_cachePool = null;
        this.m_animationRegistry = null;
        this.m_resourceLoader = null;
    }

    /**
     * 打开UI
     * @param options UIOptions
     * @returns UI节点
     */
    async open(options: UIOptions): Promise<cc.Node | null> {
        // - 检查 UIOptions 是否存在
        if (!this.validateOptions(options)) {
            return null;
        }

        // 存储 UIOptions
        if (!this.m_optionsMap.has(options.uiName)) {
            this.m_optionsMap.set(options.uiName, options);
        }

        // 1、检查是否正在打开中，如果正在打开中，直接返回打开的 promise
        if (this.m_openingLocks.has(options.uiName)) {
            return this.m_openingLocks.get(options.uiName)!;
        }

        // 2、执行打开逻辑
        const promise = (async (): Promise<cc.Node> => {

            let uiNode: cc.Node = null;

            // - 如果已经打开，直接返回已打开的节点
            if (this.m_uiOpenedMap.has(options.uiName)) {
                uiNode = this.m_uiOpenedMap.get(options.uiName);
                uiNode.active = true;
            } else {
                // - 从缓存池或资源加载器加载UI节点
                uiNode = await this.getUINode(options);
                if (!uiNode) {
                    return;
                }

                // 添加到 UI 层
                if (!this.addUINodeToLayer(options, uiNode)) {
                    return;
                }

                // 添加到缓存池
                this.addUINodeToCachePool(options, uiNode)
            }         

            // 播放打开动画
            await this.playOpenAnimation(options, uiNode);

            // - 存储已打开的 uiName → 节点
            if(!this.m_uiOpenedMap.has(options.uiName)){
                this.m_uiOpenedMap.set(options.uiName, uiNode);
            }            
            
            return uiNode;
        })();

        // 添加到正在打开中
        this.m_openingLocks.set(options.uiName, promise);

        // 返回UI节点
        try {
            await promise;
        } finally {
            // 从正在打开中移除
            this.m_openingLocks.delete(options.uiName);
        }
    }


    /**
     * 关闭UI
     * @param uiName UI名称
     * @returns 关闭 Promise
     */
    async close(uiName: string): Promise<void> {

        // - 获取 UIOptions
        const options = this.m_optionsMap.get(uiName)!;
        // - 检查 UIOptions 是否存在
        if (!options) {
            console.error(`找不到 UIOptions 用于 uiName ${uiName}`);
            return;
        }

        // 1、无 uiName 或 未打开，直接返回
        if (!uiName || !this.m_uiOpenedMap.has(uiName)) {
            return;
        }

        // 2、检查是否正在关闭中，如果正在关闭中，直接返回关闭的 promise
        if (this.m_closingLocks.has(uiName)) {
            return this.m_closingLocks.get(uiName)!;
        }

        // 3、执行关闭逻辑
        const promise = (async (): Promise<void> => {
            // - 获取 UI 节点
            const uiNode = this.m_uiOpenedMap.get(uiName)!;
            if (!uiNode) {
                return;
            }
            // - 播放关闭动画
            await this.playCloseAnimation(options, uiNode);

            // - 检查是否需要销毁节点
            if(options.destroyOnClose){
                // - 从 UI 层移除UI节点
                this.removeUINodeFromLayer(options, uiNode);                
                this.m_uiOpenedMap.delete(uiName);
                uiNode.destroy();
            }else{
                uiNode.active = false;
            }          
        })();

        // 添加到正在关闭中
        this.m_closingLocks.set(uiName, promise);

        // 返回关闭 Promise
        try {
            await promise;
        } finally {
            // 从正在关闭中移除
            this.m_closingLocks.delete(uiName);
        }
    }


    /**
     * 关闭所有已打开的UI
     * @returns Promise<void>
     */
    async closeAll(): Promise<void> {
        // - 关闭所有已打开的 UI
        for (const uiName of Object.keys(this.m_uiOpenedMap)) {
            await this.close(uiName);
        }
    }

    /**
     * 检查UI是否已打开
     * @param uiName UI名称
     * @returns 是否已打开
     */
    isOpened(uiName: string): boolean {
        return this.m_uiOpenedMap.has(uiName);
    }

    /**
     * 清除所有已打开的UI
     */
    clear(): void {
        this.m_uiOpenedMap.clear();
        this.m_optionsMap.clear();
        this.m_openingLocks.clear();
        this.m_closingLocks.clear();
    }


    //========================== 私有方法 ==========================

    /**
     * 验证 UIOptions 是否有效
     * @param options UIOptions
     * @returns 是否有效
     */
    private validateOptions(options: UIOptions): boolean {
        const { uiName, type, layer, path, prefab } = options;
        if (!uiName) {
            console.error("uiName is required");
            return false;
        }
        if (!type) {
            console.error("type is required");
            return false;
        }
        if (!layer) {
            console.error("layer is required");
            return false;
        }
        if (type === 'path' && !path) {
            console.error("path is required when type is path");
            return false;
        }
        if (type === 'prefab' && !prefab) {
            console.error("prefab is required when type is prefab");
            return false;
        }
        return true;
    }

    /**
     * 获取 UI 节点
     * @param options UIOptions
     * @returns UI 节点或 null
     */
    private async getUINode(options: UIOptions): Promise<cc.Node | null> {
        const uiNode = this.getUINodeFromCachePool(options);
        if (uiNode) {
            return uiNode;
        }
        return this.initUINode(options);
    }

    /**
     * 从缓存池获取 UI 节点
     * @param options UIOptions
     * @returns UI 节点
     */
    private getUINodeFromCachePool(options: UIOptions): cc.Node {
        const { uiName } = options;
        return this.m_cachePool.get("", uiName) ?? null;
    }

    /**
     * 初始化 UI 节点
     * @param options UIOptions
     * @returns UI 节点或 null
     */
    private async initUINode(options: UIOptions): Promise<cc.Node | null> {
        const { type, path, prefab } = options;
        if (type === 'path') {
            try {
                const uiNode = await this.m_resourceLoader.load<cc.Prefab>(path);
                return cc.instantiate(uiNode) ?? null;
            } catch (error) {
                console.error(`initUINode:load: 加载路径 ${path} 失败`, error);
                return null;
            }
        }
        if (type === 'prefab') {
            return cc.instantiate(prefab) ?? null;
        }
        return null;
    }

    /**
     * 添加 UI 节点到 UI 层
     * @param options UIOptions
     * @param uiNode UI 节点
     */
    private addUINodeToLayer(options: UIOptions, uiNode: cc.Node): boolean {
        const { layer } = options;
        const uiLayer = this.m_layerManager.getLayer(layer);
        if (!uiLayer) {
            console.error("未找到 UI 层: " + layer);
            return false;
        }
        uiLayer.addChild(uiNode);
        if (options.zIndex !== undefined) {
            uiNode.zIndex = options.zIndex;
        }
        return true;
    }

    /**
     * 添加 UI 节点到缓存池 
     * @param options UIOptions
     * @param uiNode UI 节点
     */
    private addUINodeToCachePool(options: UIOptions, uiNode: cc.Node): boolean {
        const { uiName, cacheable, layer } = options;
        // 缓存池不缓存
        if (!cacheable) {
            return false;
        }
        // 缓存池已缓存
        if (this.m_cachePool.has(layer, uiName)) {
            return false;
        }
        // 添加到缓存池
        this.m_cachePool.add(layer, uiName, uiNode);
        return true;
    }

    /**
     * 播放打开动画
     * @param options UIOptions
     * @param uiNode UI 节点
     */
    private async playOpenAnimation(options: UIOptions, uiNode: cc.Node): Promise<void> {
        const { uiName, hasAnimation } = options;
        if (!hasAnimation) {
            return;
        }

        const animationCom = uiNode.getComponent(UIAnimationComponent);
        if (!animationCom) {
            console.error(`没有找到 ${uiName} 的动画组件`);
            return;
        }

        const animationOptions: UIAnimationOptions = {
            durationSecond: animationCom.showDuration,
            easing: this.getEasingString(animationCom.easing),
            node: animationCom.node,
            animationNode: animationCom.animationNode
        };

        const animationName = this.getAnimationName(animationCom.showAnimation);

        const animation = this.m_animationRegistry.get(animationName);
        if (!animation) {
            console.error(`没有找到 ${animationName} 的动画`);
            return;
        }

        await animation.showAsync(animationOptions);
    }


    /**
     * 播放关闭动画
     * @param options UIOptions
     * @param uiNode UI 节点
     */
    private async playCloseAnimation(options: UIOptions, uiNode: cc.Node): Promise<void> {
        const { uiName, hasAnimation } = options;
        if (!hasAnimation) {
            return;
        }

        const animationCom = uiNode.getComponent(UIAnimationComponent);
        if (!animationCom) {
            console.error(`没有找到 ${uiName} 的动画组件`);
            return;
        }

        const animationOptions: UIAnimationOptions = {
            durationSecond: animationCom.hideDuration,
            easing: this.getEasingString(animationCom.easing),
            node: animationCom.node,
            animationNode: animationCom.animationNode
        };


        const animationName = this.getAnimationName(animationCom.hideAnimation);
        const animation = this.m_animationRegistry.get(animationName);
        if (!animation) {
            console.error(`没有找到 ${animationName} 的动画`);
            return;
        }

        await animation.hideAsync(animationOptions);
    }

    /**
     * 从 UI 层移除 UI 节点
     * @param options UIOptions
     * @param uiNode UI 节点
     */
    private removeUINodeFromLayer(options: UIOptions, uiNode: cc.Node): boolean {
        const { layer } = options;
        const uiLayer = this.m_layerManager.getLayer(layer);
        if (!uiLayer) {
            console.error(`未找到 ${layer} 层级`);
            return false;
        }
        uiLayer.removeChild(uiNode);
        return true;
    }

    /**
     * 获取 动画 的名字
     * @param animationName 
     * @returns 
     */
    private getAnimationName(animationName: number): string {
        return UIAnimationTypeMap[animationName];
    }

    /**
     * 获取 easing 字符串
     * @param easing easing 类型
     * @returns easing 字符串
     */
    private getEasingString(easing: number): string {
        return EasingTypeMap[easing];
    }
}
