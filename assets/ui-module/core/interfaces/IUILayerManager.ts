export interface IUILayerManager {
    /**
     * 创建所有UI层级节点
     * @param root 根节点
     */
    createLayers(root: cc.Node): void;

    /**
     * 销毁所有UI层级节点
     */
    destroyLayers(): void;

    /**
     * 创建UI层级节点
     * @param layerName 层级名称
     * @param root 根节点
     * @param zIndex 层级索引
     * @returns 创建的层级节点
     */
    createLayer(root: cc.Node, layerName: string, zIndex: number): cc.Node;

    /**
    * 销毁UI层级节点
    * @param layerName 层级名称
    */
    destroyLayer(layerName: string): void;

    /**
     * 获取UI层级节点
     * @param layerName 层级名称
     * @returns 层级节点
     */
    getLayer(layerName: string): cc.Node;

    /**
     * 是否存在UI层级节点
     * @param layerName 层级名称
     * @returns 是否存在
     */
    hasLayer(layerName: string): boolean;
}