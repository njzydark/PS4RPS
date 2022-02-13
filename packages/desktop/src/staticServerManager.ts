import fs from 'fs-extra';
import http from 'http';
import serveStatic from 'serve-static';

import { getIp } from './utils';

class StaticServerManager {
  private static instance: StaticServerManager;

  static getInstance() {
    if (!StaticServerManager.instance) {
      StaticServerManager.instance = new StaticServerManager();
    }
    return StaticServerManager.instance;
  }

  server: http.Server;
  port?: number;
  serve?: serveStatic.RequestHandler<http.ServerResponse>;
  directoryPath?: string;

  constructor() {
    this.server = http.createServer();
  }

  async createServer({
    directoryPath,
    port
  }: {
    directoryPath: string;
    port: number;
  }): Promise<{ url?: string; errorMessage?: string }> {
    try {
      if (this.server.listening) {
        await new Promise((resolve, reject) => {
          this.server.close(err => {
            if (err) {
              reject(err);
            } else {
              resolve(true);
            }
          });
        });
        this.server = http.createServer();
        this.directoryPath = undefined;
      }

      return await new Promise<{
        url?: string;
        errorMessage?: string;
      }>((resolve, reject) => {
        this.serve = serveStatic(directoryPath, { index: false });

        this.server.on('request', (req, res) => {
          const { url } = req;
          if (url?.startsWith('/api')) {
            this.handleApiRequest(req, res);
          } else {
            if (this.serve) {
              this.serve(req, res, () => {
                res.statusCode = 200;
                return res.end();
              });
            } else {
              res.statusCode = 404;
              return res.end();
            }
          }
        });

        this.server.on('error', (err: Error & { code?: string }) => {
          if (err?.code === 'EADDRINUSE') {
            reject(`Port ${port} is already in use.`);
            return;
          }
          reject(err);
        });

        this.server.listen(port, '0.0.0.0', () => {
          this.directoryPath = directoryPath;
          this.port = port;
          const ip = getIp();
          console.log(`Static server is running at http://${ip}:${port}`);
          resolve({
            url: ip ? `http://${ip}:${port}` : undefined
          });
        });
      });
    } catch (err) {
      console.error(`Failed to create server: ${err}`);
      return {
        errorMessage: (err as Error).message
      };
    }
  }

  async handleApiRequest(req: http.IncomingMessage, res: http.ServerResponse) {
    try {
      const { url, headers } = req;
      if (url?.startsWith('/api/files')) {
        const { searchParams } = new URL(url, `http://${headers.host}`);
        let path = searchParams?.get('path') || '/';
        if (!path.startsWith('/')) {
          path = `/${path}`;
        }
        if (!path.endsWith('/')) {
          path = `${path}/`;
        }

        if (!this.directoryPath) {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          return res.end(
            JSON.stringify({
              error: 'DirectoryPath is not found.'
            })
          );
        }

        const files = await fs.readdir(this.directoryPath + path, { withFileTypes: true });
        const fileListPromises = files.map(async file => {
          const fileInfo = await fs.statSync(`${this.directoryPath}/${file.name}`);
          return {
            filename: path + file.name,
            basename: file.name,
            type: file.isDirectory() ? 'directory' : 'file',
            size: fileInfo.size,
            lastmod: fileInfo.mtime
          };
        });
        const fileList = await Promise.all(fileListPromises);
        console.log(fileList);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        return res.end(JSON.stringify(fileList));
      } else {
        res.statusCode = 404;
        return res.end();
      }
    } catch (err) {
      console.error(`Failed to handle api request: ${err}`);
      res.statusCode = 500;
      return res.end((err as Error).message);
    }
  }
}

export const staticServerManager = StaticServerManager.getInstance();

// staticServerManager.createServer({
//   port: 8080,
//   directoryPath: '/Users/njzy/Downloads/ps4'
// });

// setTimeout(() => {
//   staticServerManager.createServer({
//     port: 8081,
//     directoryPath: '/Users/njzy/Downloads'
//   });
// }, 2000);
