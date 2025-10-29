import { UIAnimationOptions } from "./UIAnimationOptions";

export interface IUIAnimation {
    /**
     * 异步显示 UI 动画
     * @returns Promise<void> 动画完成后 resolve
     */
    showAsync(options: UIAnimationOptions): Promise<void>;

    /**
     * 异步隐藏 UI 动画
     * @returns Promise<void> 动画完成后 resolve
     */
    hideAsync(options: UIAnimationOptions): Promise<void>;

    /**
     * 显示动画（回调方式）
     * @param callback 动画完成后回调
     */
    show(options: UIAnimationOptions, callback?: () => void): void;

    /**
     * 隐藏动画（回调方式）
     * @param callback 动画完成后回调
     */
    hide(options: UIAnimationOptions, callback?: () => void): void;
}
