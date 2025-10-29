import { UIAnimationBase } from "../core/base/UIAnimationBase";
import { UIAnimationOptions } from "../core/interfaces/UIAnimationOptions";

/**
 * 淡入淡出动画
 */
export class FadeAnimation extends UIAnimationBase {

    private readonly m_defaultDurationSecond = 0.3;
    private readonly m_defaultEasing = "backOut";
    /**
     * 显示动画（回调方式）
     */
    public show(options: UIAnimationOptions, callback?: () => void): void {
        const { node, animationNode = node, durationSecond, easing } = options;
        const targetNode = animationNode || node;
        const targetDuration = durationSecond ?? this.m_defaultDurationSecond;
        const targetEasing = easing ?? this.m_defaultEasing;

        if (!targetNode) {
            return;
        }

        try {
            // 确保节点初始透明度为0
            targetNode.opacity = 0;

            cc.tween(targetNode)
                .to(targetDuration, { opacity: 255 }, { easing: targetEasing })
                .call(() => callback?.())
                .start();
        } catch (error) {
            console.error("FadeAnimation show error:", error);
            // 避免动画失败导致流程卡死
            callback?.();
        }
    }

    /**
     * 隐藏动画（回调方式）
     */
    public hide(options: UIAnimationOptions, callback?: () => void): void {
        const { node, animationNode = node, durationSecond, easing } = options;
        const targetNode = animationNode || node;
        const targetDuration = durationSecond ?? this.m_defaultDurationSecond;
        const targetEasing = easing ?? this.m_defaultEasing;

        if (!targetNode) {
            return;
        }

        try {
            cc.tween(targetNode)
                .to(targetDuration, { opacity: 0 }, { easing: targetEasing })
                .call(() => {
                    node.active = false;
                    callback?.();
                })
                .start();
        } catch (error) {
            console.error("FadeAnimation hide error:", error);
            // 避免动画失败导致流程卡死
            callback?.();
        }
    }
}