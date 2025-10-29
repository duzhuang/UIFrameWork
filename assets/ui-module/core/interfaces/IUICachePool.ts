export interface IUICachePool {
    /**
     * 缓存UI节点
     * @param layer 缓存层名称
     * @param uiName UI节点名称
     * @param uiNode UI节点
     */
    add(layer: string, uiName: string, uiNode: cc.Node): void;

    /**
     * 从缓存中获取UI节点
     * @param layer 缓存层名称
     * @param uiName UI节点名称
     * @returns UI节点
     */
    get(layer: string, uiName: string): cc.Node | null;

    /**
     * 是否存在缓存的UI节点
     * @param layer 缓存层名称
     * @param uiName UI节点名称
     * @returns 是否存在
     */
    has(layer: string, uiName: string): boolean;

    /**
     * 从缓存中移除UI节点
     * @param layer 缓存层名称
     * @param uiName UI节点名称
     */
    remove(layer: string, uiName: string): void;

    /**
     * 清空缓存的UI节点
     * @param layer 缓存层名称（可选）
     */
    clear(layer?: string): void;
}