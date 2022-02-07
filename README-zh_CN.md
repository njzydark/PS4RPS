# PS4RPS

[![GitHub release (latest by date including pre-releases](https://img.shields.io/github/v/release/njzydark/PS4RPS?include_prereleases)](https://github.com/njzydark/PS4RPS/releases/latest)
[![Build/release](https://github.com/njzydark/PS4RPS/actions/workflows/build.yaml/badge.svg)](https://github.com/njzydark/PS4RPS/actions/workflows/build.yaml)
[![GitHub](https://img.shields.io/github/license/njzydark/PS4RPS)](https://github.com/njzydark/PS4RPS/blob/master/LICENSE)

使用WebDAV为PS4远程安装PKG

![PS4RPS.png](assets/PS4RPS.png)

简体中文 | [Englis](./README.md)

## 特性

- 支持 MacOS, Windows 和 Linux
- 支持暗黑模式
- 支持暂停和恢复安装任务
- 支持利用远程的WebDAV服务器进行安装
- 支持从本地文件夹创建WebDAV服务器
- 支持多个PS4 Host和WebDAV Host配置

## 使用

1. 从此页面下载需要的安装程序 [release page](https://github.com/njzydark/PS4RPS/releases)
2. 打开下载好的安装程序
3. 添加PS4 Host配置，这里需要填写完整的url，例如: http://192.168.0.11:12800 端口一般为12800
4. 添加WebDav Host配置，这里有两种方式
   - URL: 使用远程的服务器地址，这里需要填写完整的url 如果有用户密码也需要填写上
   - Directory: 通过本地文件夹创建WebDAV
5. 在文件列表里点击需要的安装的pkg名称即可向PS4发送安装任务，如果发送成功会有相应提示

**注意** 在发送安装任务之前PS4必须安装此PKG [remote pkg installer](https://gist.github.com/flatz/60956f2bf1351a563f625357a45cd9c8) 并打开运行

## 开发

```bash
pnpm install
pnpm run all:dev
pnpm run desktop:start
```

## 打包

```bash
pnpm install
pnpm run all:build
pnpm run desktop:dist
```

## 常见问题

1. 是否有Web版本?

  当然有，如果你不需要从本地文件夹创建WebDAV Server而只使用远程的地址，例如NAS环境下，此时确实只需要Web版本即可 但是因为PS4的Remote Pkg Install程序存在CORS的bug [cors bug](https://github.com/flatz/ps4_remote_pkg_installer/issues/10)，所以目前还不能使用

2. 为什么arm版本的mac安装程序打开失败?

   因为没有签名，你需要在终端执行一下此命令:

   ```bash
   sudo xattr -r -d com.apple.quarantine /Applications/PS4RPS.app
   ```

## 后续计划

- [ ] 自动发现PS4主机地址
- [ ] 修复PS4 Remote Pkg Install的cors bug [cors bug](https://github.com/flatz/ps4_remote_pkg_installer/issues/10) 并发布纯Web版本
- [ ] 支持在文件列表显示更多的pkg文件信息，例如icon和titleID
