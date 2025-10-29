import { UIAnimationType } from "../config/UICustomAnimationConfig";
import { EasingType } from "../config/UIEasingTypes";

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("UI/UIAnimationComponent")
export default class UIAnimationComponent extends cc.Component {

    @property({ tooltip: "使用内置动画" })
    useBuiltInAnimation = true;

    @property({
        tooltip: "自定义显示动画", visible() {
            return !this.useBuiltInAnimation;
        }
    })
    customShowAnimationName = "";

    @property({
        tooltip: "自定义隐藏动画", visible() {
            return !this.useBuiltInAnimation;
        }
    })
    customHideAnimationName = "";


    @property({
        type: UIAnimationType, tooltip: '显示动画', visible() {
            return this.useBuiltInAnimation;
        }
    })
    showAnimation = UIAnimationType.FADE;

    @property({
        type: UIAnimationType, tooltip: '隐藏动画', visible() {
            return this.useBuiltInAnimation;
        }
    })
    hideAnimation = UIAnimationType.FADE;

    @property({ type: cc.Float, tooltip: '显示动画时长（秒）' })
    showDuration = 0.3;

    @property({ type: cc.Float, tooltip: '隐藏动画时长（秒）' })
    hideDuration = 0.3;

    @property({ type: cc.Node, tooltip: '动画节点' })
    animationNode: cc.Node = null;

    @property({ type: EasingType, tooltip: '动画曲线' })
    easing = EasingType.BACK_IN;

    @property({ visible: false, override: true })
    node: cc.Node = this.node;


    protected start(): void {
        
    }   
}