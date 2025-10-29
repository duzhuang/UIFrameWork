import { IUICachePool } from "./interfaces/IUICachePool";

export class UICachePool implements IUICachePool {

    private m_layerPools: Map<string, Map<string, cc.Node>> = new Map();

    private static m_instance: UICachePool;

    private constructor() { }

    public static get instance(): UICachePool {
        if (!this.m_instance) {
            this.m_instance = new UICachePool();
        }
        return this.m_instance;
    }



    public add(layer: string, uiName: string, uiNode: cc.Node): void {
        if (!this.m_layerPools.has(layer)) {
            this.m_layerPools.set(layer, new Map());
        }

        const layerPool = this.m_layerPools.get(layer)!;
        if (!layerPool.has(uiName)) {
            layerPool.set(uiName, uiNode);
        }
    }

    public get(layer: string, uiName: string): cc.Node | null {
        if (!this.has(layer, uiName)) {
            return null;
        }
        const layerPool = this.m_layerPools.get(layer)!;
        return layerPool.get(uiName)!;
    }

    public has(layer: string, uiName: string): boolean {
        if (!this.m_layerPools.has(layer)) {
            return false;
        }

        const layerPool = this.m_layerPools.get(layer)!;
        if (!layerPool.has(uiName)) {
            return false;
        }

        const pool = layerPool.get(uiName);
        if (!pool) {
            return false;
        }

        return true;
    }


    public remove(layer: string, uiName: string): void {
        if (!this.m_layerPools.has(layer)) {
            return;
        }

        const layerPool = this.m_layerPools.get(layer)!;
        if (!layerPool.has(uiName)) {
            return;
        }

        layerPool.delete(uiName);
    }

    public clear(layer?: string): void {
        if (layer) {
            this.m_layerPools.delete(layer);
        } else {
            this.m_layerPools.clear();
        }
    }

}