import { UIAnimationBase } from "../core/base/UIAnimationBase";
import { UIAnimationOptions } from "../core/interfaces/UIAnimationOptions";

/**
 * 缩放动画
 */
export class ScaleAnimation extends UIAnimationBase {
    private readonly m_defaultDurationSecond = 0.3;
    private readonly m_defaultEasing = "backOut";

    public show(options: UIAnimationOptions, callback?: () => void): void {
        const { node, animationNode, durationSecond, easing } = options;
        const targetNode = animationNode || node;
        const targetDurationSecond = durationSecond ?? this.m_defaultDurationSecond;
        const targetEasing = easing ?? this.m_defaultEasing;

        //原始的缩放值
        const originalSacle = targetNode.scale;        
        targetNode.scale = 0;

        try {            
            cc.tween(targetNode)
                .to(targetDurationSecond, { scale: originalSacle }, { easing: targetEasing })
                .call(() => {                    
                    callback?.();
                })
                .start();
        } catch (error) {
            console.error("ScaleAnimation show error:", error);
            callback?.();
        }
    }


    public hide(options: UIAnimationOptions, callback?: () => void): void {
        const { node, animationNode, durationSecond, easing } = options;
        const targetNode = animationNode || node;
        const targetDurationSecond = durationSecond ?? this.m_defaultDurationSecond;
        const targetEasing = easing ?? this.m_defaultEasing;
         //原始的缩放值
        const originalSacle = targetNode.scale; 
     
        try {            
            cc.tween(targetNode)
                .to(targetDurationSecond, { scale: 0 }, { easing: targetEasing })
                .call(() => {
                    node.active = false;
                    //恢复原始的缩放值
                    targetNode.scale = originalSacle;
                    callback?.();
                })
                .start();
        } catch (error) {
            console.error("ScaleAnimation hide error:", error);
            callback?.();
        }
    }
}