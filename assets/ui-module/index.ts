import { UIAnimationBase } from "./core/base/UIAnimationBase";
import { UIManager } from "./core/UIManager";
import { UIModuleInitializer } from "./initializer/UIModuleInitializer";


export const UI = {
    init: UIModuleInitializer.init,
    manager: UIManager.instance,
    registerCustomAnimation: UIModuleInitializer.registerCustomAnimation,
    UIAnimationBase: UIAnimationBase,
}