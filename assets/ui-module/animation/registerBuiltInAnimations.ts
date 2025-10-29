import { UIAnimationConfig } from '../config/UICustomAnimationConfig';
import { UIAnimationRegistry } from './UIAnimationRegistry';

/**
 * 注册内建动画
 */
export function registerBuiltInAnimations(animationRegistry: UIAnimationRegistry): void {
    UIAnimationConfig.forEach(({ animationName, animationClass }) => {
        animationRegistry.register(animationName, animationClass);
    });
}

/**
 * 注销内建动画
 */
export function releaseBuiltInAnimations(animationRegistry: UIAnimationRegistry): void {
    animationRegistry.clear();
}
