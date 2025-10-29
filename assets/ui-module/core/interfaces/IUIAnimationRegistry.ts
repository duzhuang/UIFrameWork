import { UIAnimationBase } from "../base/UIAnimationBase";

export interface IUIAnimationRegistry {
    /**
     * 注册UI动画
     * @param aniName UI动画名称
     * @param uiAnimation UI动画实例
     */
    register(aniName: string, ctor: new () => UIAnimationBase): void;

    /**
     * 从注册器中获取UI动画
     * @param aniName UI动画名称
     * @returns UI动画实例
     */
    get(aniName: string): UIAnimationBase | null;

    /**
     * 是否存在注册的UI动画
     * @param aniName UI动画名称
     * @returns 是否存在
     */
    has(aniName: string): boolean;

    /**
     * 清空注册的UI动画
     */
    clear(): void;

    /**
     * 获取所有注册的UI动画名称
     * @returns UI动画名称数组
     */
    list(): string[];
}