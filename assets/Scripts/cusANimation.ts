import { UIAnimationBase } from "../ui-module/core/base/UIAnimationBase";
import { UIAnimationOptions } from "../ui-module/core/interfaces/UIAnimationOptions";

export class CustomAnimation extends UIAnimationBase {
    public show(options: UIAnimationOptions, callback?: () => void): void {
        const { node, animationNode, durationSecond, easing } = options;
        const targetNode = animationNode || node;
        const targetDurationSecond = durationSecond || 0.2;
        const targetEasing = easing || "backOut";

        cc.tween(targetNode)
            .to(targetDurationSecond, { scale: 0.5 }, { easing: targetEasing })   
            .call(() => callback?.())         
            .start();       
    }
    public hide(options: UIAnimationOptions, callback?: () => void): void {
        const { node, animationNode, durationSecond, easing } = options;
        const targetNode = animationNode || node;
        const targetDurationSecond = durationSecond || 0.2;
        const targetEasing = easing || "backOut";
        cc.tween(targetNode)
            .to(targetDurationSecond, { scale: 0 }, { easing: targetEasing })   
            .call(() => callback?.())         
            .start();       
    }
}