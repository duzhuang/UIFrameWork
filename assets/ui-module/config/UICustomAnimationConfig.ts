import { FadeAnimation } from "../animation/FadeAnimation";
import { ScaleAnimation } from "../animation/ScaleAnimation";

export const UIAnimationConfig = [
    {
        /** 动画名称 */
        animationName: "fade",
        /** 动画类 */
        animationClass: FadeAnimation,
    },
    {
        /** 动画名称 */
        animationName: "scale",
        /** 动画类 */
        animationClass: ScaleAnimation,
    }
] as const;


export const UIAnimationType = cc.Enum({
    FADE: 0,
    SCALE: 1,
    SLIDE_RIGHT: 2,
    SLIDE_LEFT: 3,
    SLIDE_TOP: 4,
    SLIDE_BOTTOM: 5,
});

export const UIAnimationTypeMap = {
    [UIAnimationType.FADE]: "fade",
    [UIAnimationType.SCALE]: "scale",
    [UIAnimationType.SLIDE_RIGHT]: "slide-right",
    [UIAnimationType.SLIDE_LEFT]: "slide-left",
    [UIAnimationType.SLIDE_TOP]: "slide-top",
    [UIAnimationType.SLIDE_BOTTOM]: "slide-bottom",
}
