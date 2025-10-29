import { IResourceLoader } from "./interfaces/IResourceLoader";

/**
 * 资源加载器
 */
export class ResourceLoader implements IResourceLoader {

    load<T>(path: string): Promise<T> {
        if (!path) {
            throw new Error("ResourceLoader:load: 路径不能为空");
        }
        if (path === "") {
            throw new Error("ResourceLoader:load: 路径不能为空");
        }

        return new Promise<T>((resolve, reject) => {
            cc.resources.load(path, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res as T);
                }
            });
        });
    }


    preload<T>(path: string): Promise<T> {
        if (!path) {
            throw new Error("ResourceLoader:preload: 路径不能为空");
        }
        if (path === "") {
            throw new Error("ResourceLoader:preload: 路径不能为空");
        }

        return new Promise<T>((resolve, reject) => {
            cc.resources.preload(path, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res as T);
                }
            });
        });
    }


    release(path: string): void {
        if (!path) {
            throw new Error("ResourceLoader:release: 路径不能为空");
        }
        if (path === "") {
            throw new Error("ResourceLoader:release: 路径不能为空");
        }
        cc.resources.release(path);
    }

}
