import { IUIBase } from "../interfaces/IUIBase";

export abstract class UIBase implements IUIBase {

    private m_openData?: any;

    onOpen(data?: any): void {
        this.m_openData = data;
        this.init(data);
    }
    onOpened(): void {

    }
    onClose(): void {

    }
    onClosed(): void {

    }
    onCleanUp(): void {
        this.m_openData = null;
    }

    /**
     * 子类必须实现
     * 初始化UI
     * @param data 打开数据
     */
    protected abstract init(data?: any): void;

}