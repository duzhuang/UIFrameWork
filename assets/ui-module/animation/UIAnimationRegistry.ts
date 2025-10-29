import { UIAnimationBase } from "../core/base/UIAnimationBase";
import { IUIAnimationRegistry } from "../core/interfaces/IUIAnimationRegistry";

export class UIAnimationRegistry implements IUIAnimationRegistry {

    /** 注册的UI动画映射 */
    private m_uiAnimations: Map<string, new () => UIAnimationBase> = new Map();

    register(aniName: string, ctor: new () => UIAnimationBase): void {
        if (this.m_uiAnimations.has(aniName)) {
            console.warn(`UIAnimationRegistry:register: 已注册UI动画 ${aniName}`);
            return;
        }
        this.m_uiAnimations.set(aniName, ctor);
    }

    get(aniName: string): UIAnimationBase | null {
        const ctor = this.m_uiAnimations.get(aniName);
        if (!ctor) {
            console.warn(`UIAnimationRegistry:get: 未注册UI动画 ${aniName}`);
            return null;
        }
        return new ctor();
    }


    has(aniName: string): boolean {
        return this.m_uiAnimations.has(aniName);
    }

    /**
     * 清空注册的UI动画
     */
    clear(): void {
        this.m_uiAnimations.clear();
    }

    /**
     * 获取所有注册的UI动画名称
     * @returns UI动画名称数组
     */
    list(): string[] {
        return Array.from(this.m_uiAnimations.keys());
    }
}