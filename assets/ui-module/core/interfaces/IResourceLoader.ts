export interface IResourceLoader {
    /**
     * 加载资源
     * @param path 资源路径
     * @returns 加载完成的资源
     */
    load<T>(path: string): Promise<T>;

    /**
     * 预加载资源
     * @param path 资源路径
     */
    preload<T>(path: string): Promise<T>;

    /**
     * 释放资源
     * @param path 资源路径
     */
    release(path: string): void;
}
