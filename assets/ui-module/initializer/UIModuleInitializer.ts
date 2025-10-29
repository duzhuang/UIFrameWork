import { registerBuiltInAnimations, releaseBuiltInAnimations } from "../animation/registerBuiltInAnimations";
import { UIAnimationRegistry } from "../animation/UIAnimationRegistry";
import { UIAnimationBase } from "../core/base/UIAnimationBase";
import { ResourceLoader } from "../core/ResourceLoader";
import { UICachePool } from "../core/UICachePool";
import { UILayerManager } from "../core/UILayerManager";
import { UIManager } from "../core/UIManager";

export class UIModuleInitializer {

    /** 是否已初始化 */
    private static m_initialized = false;
    /** 是否在初始化中 */
    private static m_initing = false;

    /** 图层管理器 */
    private static m_layerManager: UILayerManager;
    /** 动画注册表 */
    private static m_animationRegistry: UIAnimationRegistry;
    /** 缓存池 */
    private static m_cachePool: UICachePool;
    /** 资源加载器 */
    private static m_resourceLoader: ResourceLoader;
    /**
     * 初始化UI模块所有依赖项
     * @param rootNode 根节点
     */
    public static async init(rootNode: cc.Node): Promise<void> {
        if (this.m_initialized) {
            console.warn("UIModuleInitializer:init: 已初始化");
            return;
        }

        if (this.m_initing) {
            console.warn("UIModuleInitializer:init: 初始化中");
            return;
        }

        this.m_initing = true;

        // 具体初始化逻辑

        // 初始化图层管理器
        this.m_layerManager = new UILayerManager();
        this.m_layerManager.createLayers(rootNode);

        // 注册内建动画
        this.m_animationRegistry = new UIAnimationRegistry();
        registerBuiltInAnimations(this.m_animationRegistry);

        // 初始化缓存池
        this.m_cachePool = UICachePool.instance;

        // 初始化资源加载器
        this.m_resourceLoader = new ResourceLoader();


        // 初始化 UIManager
        UIManager.instance.init({
            layerManager: this.m_layerManager,
            cachePool: this.m_cachePool,
            animationRegistry: this.m_animationRegistry,
            resourceLoader: this.m_resourceLoader,
        });

        this.m_initialized = true;
        this.m_initing = false;
    }



    /**
     * 销毁UI模块所有依赖项
     */
    public static async destroy(): Promise<void> {
        if (!this.m_initialized) {
            console.warn("UIModuleInitializer:destroy: 未初始化");
            return;
        }

        // 具体销毁逻辑        

        // 销毁图层管理器
        this.m_layerManager.destroyLayers();
        this.m_layerManager = null;

        // 注销内建动画
        releaseBuiltInAnimations(this.m_animationRegistry);

        // 销毁缓存池
        this.m_cachePool.clear();
        this.m_cachePool = null;

        // 销毁资源加载器        
        this.m_resourceLoader = null;

        // 销毁 UIManager
        UIManager.instance.destroy();

        this.m_initialized = false;
        this.m_initing = false;
    }


    /**
     * 注册自定义动画
     * @param animationName 动画名称
     * @param animationClass 动画类
     */
    public static registerCustomAnimation(animationName: string, animationClass: new () => UIAnimationBase): void {
        this.m_animationRegistry.register(animationName, animationClass);
    }
}