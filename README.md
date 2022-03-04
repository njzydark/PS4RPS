# PS4RPS

[![GitHub release (latest by date including pre-releases](https://img.shields.io/github/v/release/njzydark/PS4RPS?include_prereleases)](https://github.com/njzydark/PS4RPS/releases/latest)
[![Build/release](https://github.com/njzydark/PS4RPS/actions/workflows/build.yaml/badge.svg)](https://github.com/njzydark/PS4RPS/actions/workflows/build.yaml)
![GitHub deployments](https://img.shields.io/github/deployments/njzydark/PS4RPS/production?label=vercel&logo=vercel&logoColor=white)
[![GitHub](https://img.shields.io/github/license/njzydark/PS4RPS)](https://github.com/njzydark/PS4RPS/blob/master/LICENSE)

Yet another remote pkg sender for PS4

![PS4RPS.png](assets/PS4RPS.png)

English | [简体中文](./README-zh_CN.md)

## Features

- Support MacOS, Windows and Linux
- Dark Mode
- Pause and resume install task
- Use remote WebDAV server to send install task
- Create Static file server from local folder
- Multiple PS4 host and file server host config

## Motivation

There are actually quite a lot of such tools, I tried one and felt that the UI was rough and could not install the PKG file on my NAS, so I am going to develop one myself and contribute to this community, one more choice is not a bad thing.

## Usage

1. Download this app from [release page](https://github.com/njzydark/PS4RPS/releases)
2. Open the app
3. Add PS4 host (Your PS4 ip and port, The port is usually 12800), for example: http://192.168.0.11:12800
4. Add File server host
   - StaticFileServer: use local folder to create static file server
   - WebDAV: use remote WebDAV server url
5. Click pkg name from file list to send install task

**PS** Before send install task, you need install [remote pkg installer](https://gist.github.com/flatz/60956f2bf1351a563f625357a45cd9c8) on your PS4 and open it

## Dev

```bash
pnpm install
pnpm run all:dev
pnpm run desktop:start
```

## Build

```bash
pnpm install
pnpm run all:build
pnpm run desktop:dist
```

## FAQ

1. Is there a web version of this tool?

   Of course, if you do not need to create a static file server from local is possible to use the web version directly, but because of this [cors bug](https://github.com/flatz/ps4_remote_pkg_installer/issues/10), the web version is currently not available

2. How fast is the transfer?

   WebDAV depends on the speed of your WebDAV server, StaticFileServer I tested here can basically run full my local LAN bandwidth

3. Why support WebDAV?

   Because it is easy to install the pkg file on NAS using webdav

4. Why mac arm64 app open failed?

   Because the app is not signed, you need to execute this command in the terminal:

   ```bash
   sudo xattr -r -d com.apple.quarantine /Applications/PS4RPS.app
   ```

## TODO

- [ ] Auto find PS4 host
- [ ] Fix the [cors bug](https://github.com/flatz/ps4_remote_pkg_installer/issues/10) and release the web version
- [ ] Show more pkg file info, such as icon and titleID
