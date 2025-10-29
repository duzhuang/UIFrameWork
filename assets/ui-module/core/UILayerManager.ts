import { UILayerConfig } from "../config/UILayerConfig";
import { IUILayerManager } from "./interfaces/IUILayerManager";

export class UILayerManager implements IUILayerManager {

    private m_layers: Map<string, cc.Node> = new Map();

    createLayers(root: cc.Node): void {
        if (!root) {
            console.warn("UILayerManager:createLayers: 根节点为空");
            return;
        }        

        UILayerConfig.forEach((layerConfig) => {
            this.createLayer(root, layerConfig.layerName, layerConfig.zIndex);
        });
    }

    destroyLayers(): void {
        this.m_layers.forEach((layer) => {
            layer.destroy();
        });
        this.m_layers.clear();
    }

    createLayer(root: cc.Node, layerName: string, zIndex: number): cc.Node {

        if (!root) {
            console.warn("UILayerManager:createLayer: 根节点为空");
            return null;
        }

        if (this.hasLayer(layerName)) {
            console.warn(`UILayerManager:createLayer: 层级 ${layerName} 已存在`);
            return this.getLayer(layerName);
        }

        const layer = new cc.Node(layerName);
        layer.parent = root;
        layer.zIndex = zIndex;
        this.m_layers.set(layerName, layer);
        return layer;
    }

    destroyLayer(layerName: string): void {
        const layer = this.m_layers.get(layerName);
        if (layer) {
            layer.destroy();
            this.m_layers.delete(layerName);
        }
    }

    getLayer(layerName: string): cc.Node {
        return this.m_layers.get(layerName);
    }

    hasLayer(layerName: string): boolean {
        return this.m_layers.has(layerName);
    }

}
