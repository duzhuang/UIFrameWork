/**
 * 层级配置
 */
export const UILayerConfig = [
    {
        /** 背景层：游戏背景、界面遮罩 */
        layerName: "Background",
        zIndex: 0,
    },
    {
        /** 场景层：游戏场景、背景层 */
        layerName: "Scene",
        zIndex: 10,
    },
    {
        /** 底部 UI 层：底部导航、任务栏 */
        layerName: "Bottom",
        zIndex: 20,
    },
    {
        /** 主界面层：主界面常驻面板 */
        layerName: "Main",
        zIndex: 30,
    },
    {
        /** 弹窗层：对话框、确认框、全屏面板 */
        layerName: "PopUp",
        zIndex: 40,
    },
    {
        /** 提示层：文字提示、Toast、气泡提示 */
        layerName: "Tip",
        zIndex: 50,
    },
    {
        /** 系统层：全局遮罩、Loading 动画、截断点击事件 */
        layerName: "System",
        zIndex: 60,
    },
    {
        /** 加载层：资源加载进度条、白屏过渡 */
        layerName: "Loading",
        zIndex: 70,
    },

] as const;


// 自动提取合法层级名称类型
export type UILayerName = typeof UILayerConfig[number]["layerName"];