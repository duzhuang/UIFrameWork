export interface UIAnimationOptions {
    /** 目标节点 */
    node: cc.Node;
    /** 动画节点（可选，默认为目标节点） */
    animationNode?: cc.Node;
    /** 动画时长（秒） */
    durationSecond?: number;
    /** 缓动函数 */
    easing?: string;
}