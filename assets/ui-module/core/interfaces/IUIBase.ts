export interface IUIBase {
    /**
     * 打开UI
     * @param data 打开数据
     */
    onOpen(data?: any): void;

    /**
     * 打开UI完成
     */
    onOpened(): void;

    /**
     * 关闭UI
     */
    onClose(): void;

    /**
     * 关闭UI完成
     */
    onClosed(): void;

    /**
     * 清理UI
     */
    onCleanUp(): void;
}
