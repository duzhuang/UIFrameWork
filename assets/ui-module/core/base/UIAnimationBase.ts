import { IUIAnimation } from "../interfaces/IUIAnimation";
import { UIAnimationOptions } from "../interfaces/UIAnimationOptions";


export abstract class UIAnimationBase implements IUIAnimation {
    /**
     * 异步显示动画
     */
    public async showAsync(options: UIAnimationOptions): Promise<void> {
        return new Promise(resolve => {
            this.show(options, () => resolve());
        });
    }

    /**
     * 异步隐藏动画
     */
    public async hideAsync(options: UIAnimationOptions): Promise<void> {
        return new Promise(resolve => {
            this.hide(options, () => resolve());
        });
    }

    /**
     * 显示动画（回调方式）
     */
    public abstract show(options: UIAnimationOptions, callback?: () => void): void;

    /**
     * 隐藏动画（回调方式）
     */
    public abstract hide(options: UIAnimationOptions, callback?: () => void): void;
}