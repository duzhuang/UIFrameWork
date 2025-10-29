import { UI } from "../ui-module/index";


const { ccclass, property } = cc._decorator;

@ccclass
export default class main extends cc.Component {

    @property({ type: cc.Node, tooltip: 'UI根节点' })
    uiRootNode: cc.Node = null;

    protected onLoad(): void {
        this.initGame();
    }

    initGame() {
        UI.init(this.uiRootNode);
    }

    onClickOpen() {
        UI.manager.open({
            uiName: "prefabNode",
            type: "path",
            path: "prefabNode",
            layer: "PopUp",
            destroyOnClose: true,
        });
    }

    onClickClose() {
        UI.manager.close("prefabNode");
    }
}
