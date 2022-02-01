import { v2 as webdav } from 'webdav-server';

class WebDavServerManager {
  private static instance: WebDavServerManager;

  static getInstance() {
    if (!WebDavServerManager.instance) {
      WebDavServerManager.instance = new WebDavServerManager();
    }
    return WebDavServerManager.instance;
  }

  server?: webdav.WebDAVServer;

  async create({ directoryPath, port }: { directoryPath: string; port: number }) {
    const server = new webdav.WebDAVServer({
      requireAuthentification: false,
      port
    });
    return new Promise<boolean>((resolve, reject) => {
      try {
        server.setFileSystem('/', new webdav.PhysicalFileSystem(directoryPath), successed => {
          if (!successed) {
            reject(new Error('Failed to set file system'));
          }
          server.start(httpServer => {
            if (httpServer) {
              console.log(`WebDAV server ready on port: ${port}`);
              this.server = server;
              resolve(true);
            } else {
              reject(new Error('Failed to start WebDAV server'));
            }
          });
        });
      } catch (err) {
        reject(err);
      }
    });
  }
}

export const webDavServerManager = WebDavServerManager.getInstance();
