import { UILayerName } from "../../config/UILayerConfig";

/** 基础 UI 选项 */
interface UIBaseOptions {
    uiName: string;
    layer: UILayerName;
    zIndex?: number;
    hasAnimation?: boolean;
    allowMultiple?: boolean;
    cacheable?: boolean;
    destroyOnClose?: boolean;
}

/** 当 type 为 "path" 时，必须提供 path */
interface UIPathOptions extends UIBaseOptions {
    type: "path";
    path: string;
    prefab?: never;
}

/** 当 type 为 "prefab" 时，必须提供 prefab */
interface UIPrefabOptions extends UIBaseOptions {
    type: "prefab";
    prefab: cc.Prefab;
    path?: never;
}

/** UI 选项：根据 type 字段自动判断是 UIPathOptions 还是 UIPrefabOptions */
export type UIOptions = UIPathOptions | UIPrefabOptions;