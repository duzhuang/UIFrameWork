import { UIManagerInitOptions } from "./UIManagerInitOptions";
import { UIOptions } from "./UIOptions";

export interface IUIManager {
    /**
     * 初始化 UIManager
     */
    init(options: UIManagerInitOptions): void;

    /**
     * 打开 UI
     * @param options UIOptions
     * @returns UI 节点
     */
    open(options: UIOptions): Promise<cc.Node>;

    /**
     * 关闭 UI
     * @param uiName UI 名称
     * @returns Promise<void>
     */
    close(uiName: string): Promise<void>;


    /**
     * 关闭所有已打开的 UI
     * @returns Promise<void>
     */
    closeAll(): Promise<void>;

    /**
     * 判断 UI 是否已打开
     * @param uiName UI 名称
     * @returns 是否已打开
     */
    isOpened(uiName: string): boolean;

     /**
      * 清除所有已打开的 UI
      */
    clear(): void;
}