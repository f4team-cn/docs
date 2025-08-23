# Vortex 的扩展开发

## ⚙️ 实现原理

Vortex 的扩展系统基于 **Electron 架构** 和 **插件隔离机制**，整体流程如下：

```text
Vortex Application
       │
       ▼
 new Electron.BrowserWindow
       │  创建独立窗口加载扩展
       ▼
 loadProviderPage
       │  加载扩展前端页面（HTML / JS / CSS）
       ▼
 exposeApi
       │  向扩展暴露 Vortex 提供的 API
       ▼
 扩展通过 API 与主应用交互
```

### 详细解释

1. **Vortex Application**
   主应用启动，初始化核心模块，包括下载管理、任务调度和 UI 框架。

2. **new Electron.BrowserWindow**
   为每个扩展创建独立的 **BrowserWindow**，保证运行环境隔离，并支持自定义窗口大小、图标等。

3. **loadProviderPage**
   扩展的前端页面通过此方法加载到 BrowserWindow 中，页面可以是本地 HTML 文件或打包好的 JS/CSS。

4. **exposeApi**
   主进程通过 Electron 的 `contextBridge.exposeInMainWorld` 或 `ipcRenderer` 向扩展注入 API，常用接口示例：

| API           | 功能        | 描述                  |
|---------------|-----------|---------------------|
| `$http`       | HTTP 请求   | 用于发送 GET / POST 等请求 |
| `$__store`    | Vortex 配置 | 访问 Vortex 的配置数据     |
| `$__electron` | 系统层 API   | 提供系统相关操作            |

> 扩展开发者应通过这些 API 与 Vortex 主应用交互，而不要直接访问主进程，以确保安全性。

## 🛠 开发实战

## 📄 扩展配置文件

扩展必须包含一个 `provider.json` 文件，用于描述扩展的基本信息和运行参数。

::: code-group

```json [provider.json]
{
  "id": "test-provider",
  "name": "任务扩展",
  "description": "这是一个任务扩展",
  "author": "Yingyya",
  "version": [
    1,
    0,
    1
  ],
  "index": "index.html",
  "window": [
    400,
    650
  ]
}
```

:::

### 字段说明

| 字段              | 类型                         | 说明                                 | 示例                | 默认值          |
|-----------------|----------------------------|------------------------------------|-------------------|--------------|
| **id**          | `string`                   | 扩展唯一 ID，在用户已安装扩展中必须唯一              | `"test-provider"` | —            |
| **name**        | `string`                   | 扩展名称                               | `"任务扩展"`          | —            |
| **description** | `string`                   | 扩展简介                               | `"这是一个任务扩展"`      | —            |
| **author**      | `string`                   | 扩展作者                               | `"Yingyya"`       | —            |
| **version**     | `[number, number, number]` | 扩展版本，遵循语义化版本号（major, minor, patch） | `[1, 0, 1]`       | `[1,0,0]`    |
| **index**       | `string`                   | 扩展入口文件，相对扩展目录路径                    | `"index.html"`    | —            |
| **window**      | `[number, number]`         | 扩展窗口大小，格式 `[宽, 高]`                 | `[400, 650]`      | `[400, 650]` |

## 🌐 前端工具链支持

Vortex 扩展开发支持现代前端工具链，开发者可以根据自己的技术栈选择合适的工具进行开发。

### 使用 Vite 构建扩展

Vite 是一个现代化的前端构建工具，具有快速的冷启动和热更新功能。要使用 Vite 构建 Vortex 扩展：

1. 初始化 Vite 项目：

::: code-group

```bash [npm]
npm create vite@latest my-extension -- --template vanilla
cd my-extension
npm install
```

:::

2. 配置 `vite.config.js` 以适配 Vortex 扩展：
::: code-group

```js [vite.config.js]
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
   build: {
      rollupOptions: {
         input: {
            main: resolve(__dirname, 'index.html')
         }
      }
   }
});
```

:::
3. 开发完成后，构建项目：
::: code-group

```bash [npm]
npm run build
```

:::

4. 将生成的 `dist` 目录内容复制到扩展目录，并确保 `provider.json` 中的 `index` 字段指向正确的入口文件。

### 使用 Webpack 构建扩展

Webpack 是一个强大的模块打包工具，适用于复杂的前端项目。要使用 Webpack 构建 Vortex 扩展：

1. 初始化项目并安装 Webpack：
::: code-group

```bash [npm]

npm init -y
npm install webpack webpack-cli --save-dev
```

:::

2. 配置 `webpack.config.js`：
::: code-group

```javascript [webpack.config.js]

const path = require('path');
module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
};
```

:::

3. 构建项目：
::: code-group

```bash [npm]
npx webpack --mode production
```

:::

4. 将生成的 `dist` 目录内容复制到扩展目录，并配置 `provider.json`。

### 注意事项

- 确保构建后的文件结构符合 Vortex 扩展的要求。
- 在使用前端框架时，注意与 Vortex 提供的 API 进行集成。
- 测试扩展在 Vortex 环境中的表现，确保功能正常。

## 🧩 使用 Vortex API

Vortex 为主进程和扩展之间提供了安全的通信机制。在扩展中，您可以通过预定义的 API 与主应用进行交互。
Vortex 提供的 API 均暴露在 Windows 中，详情请参考 [Vortex API 文档](/vortex/provider-api)。

### 注意事项

- 这些 API 只能在扩展的前端代码中使用，不能在主进程中直接调用。
- 为了安全起见，不要在扩展中暴露这些 API 给不受信任的代码。
- 在使用 API 时，建议添加错误处理机制以提高扩展的稳定性。

---