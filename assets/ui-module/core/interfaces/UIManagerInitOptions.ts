import { UIAnimationRegistry } from "../../animation/UIAnimationRegistry";
import { UICachePool } from "../UICachePool";
import { UILayerManager } from "../UILayerManager";
import { IResourceLoader } from "./IResourceLoader";

export interface UIManagerInitOptions {
    layerManager: UILayerManager;
    cachePool: UICachePool;
    animationRegistry: UIAnimationRegistry;
    resourceLoader: IResourceLoader;
}
