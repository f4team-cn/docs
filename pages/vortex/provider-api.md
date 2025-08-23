# Provider API 文档

Vortex 为扩展提供了丰富的 API，以便扩展能够与主应用进行交互。这些 API 通过 `window` 对象暴露给扩展使用。

::: tip TypeScript 支持
我们提供了 TypeScript 类型定义，以便开发时进行提示补全。

::: details 点击查看/隐藏类型定义
为了获得完整的 TypeScript 类型支持，建议安装 `axios` 类型定义：

```bash [npm]
npm install @types/axios -D
```

安装完成后，你可以在项目中直接使用 Vortex 提供的全局类型定义。
完整的 `TypeScript` 类型定义如下：(provider.d.ts)


```ts [provider.d.ts]
import {
  AxiosRequestConfig,
  AxiosHeaders,
  AxiosHeaderValue,
  AxiosResponseHeaders,
} from "axios";

/** ---------------------------
 * Aria2 RPC 方法类型
 * --------------------------- */
declare type Aria2Methods =
  | "aria2.addUri"
  | "aria2.addTorrent"
  | "aria2.addMetalink"
  | "aria2.remove"
  | "aria2.forceRemove"
  | "aria2.pause"
  | "aria2.pauseAll"
  | "aria2.forcePause"
  | "aria2.forcePauseAll"
  | "aria2.unpause"
  | "aria2.unpauseAll"
  | "aria2.tellStatus"
  | "aria2.tellActive"
  | "aria2.tellWaiting"
  | "aria2.tellStopped"
  | "aria2.getUris"
  | "aria2.getFiles"
  | "aria2.getPeers"
  | "aria2.getServers"
  | "aria2.changePosition"
  | "aria2.changeUri"
  | "aria2.changeOption"
  | "aria2.getOption"
  | "aria2.getGlobalOption"
  | "aria2.changeGlobalOption"
  | "aria2.getGlobalStat"
  | "aria2.purgeDownloadResult"
  | "aria2.removeDownloadResult"
  | "aria2.getVersion"
  | "aria2.getSessionInfo"
  | "aria2.shutdown"
  | "aria2.forceShutdown"
  | "aria2.saveSession"
  | "system.multicall";

declare type DeprecatedAria2Methods =
  | "aria2.addUri"
  | "aria2.addTorrent"
  | "aria2.addMetalink";

/** ---------------------------
 * Aria2 RPC 请求与响应
 * --------------------------- */
declare type Aria2RPCRequest<T extends unknown[] = unknown[]> = {
  jsonrpc?: "2.0";
  method: Omit<Aria2Methods, DeprecatedAria2Methods>;
  id?: string | number | null;
  params?: T;
};

declare type Aria2RPCResponse<T = unknown> = {
  jsonrpc: "2.0";
  id?: string;
  method?: Omit<Aria2Methods, DeprecatedAria2Methods>;
  result?: T;
  error?: {
    code: number;
    message: string;
  };
};

declare type Aria2RPCMultiCallRequest = Array<
  Pick<Aria2RPCRequest, "params"> & {
    methodName: Omit<Aria2Methods, DeprecatedAria2Methods>;
  }
>;

/** ---------------------------
 * 新任务参数构建
 * --------------------------- */
declare type NewTaskBuilder = {
  links: string;
  filename: string;
  split?: number;
  storagePath?: string;
  userAgent?: string;
  cookie?: string;
  referer?: string;
  headers?: Array<{ key: string; value: string }>;
};

/** ---------------------------
 * Aria2 API 接口
 * --------------------------- */
declare type Aria2Api = {
  call: (request: Aria2RPCRequest) => Promise<Aria2RPCResponse>;
  multiCall: (request: Aria2RPCMultiCallRequest) => Promise<Aria2RPCResponse>;
  send: (request: Aria2RPCRequest) => Promise<string>;
  newTask: (request: NewTaskBuilder) => Promise<Aria2RPCResponse>;
};

/** ---------------------------
 * HTTP 请求与响应
 * --------------------------- */
declare interface HttpRequest {
  method: AxiosRequestConfig["method"];
  url: string;
  data?: any;
  config?: AxiosRequestConfig;
}

declare interface HttpResponse<T = any> {
  data?: T;
  status: number;
  error?: string;
  headers?:
    | AxiosResponseHeaders
    | (Partial<AxiosHeaders> & {
        "Content-Length"?: AxiosHeaderValue;
        "Content-Encoding"?: AxiosHeaderValue;
        Server?: AxiosHeaderValue;
        "Content-Type"?: AxiosHeaderValue;
        "Cache-Control"?: AxiosHeaderValue;
        "set-cookie"?: string[];
      });
}

/** ---------------------------
 * 应用状态存储
 * --------------------------- */
declare type AppStoreSchema = {
  "aria2-args": string[];
  "history-storage-path": string[];
  language: string;
  "auto-start": boolean;
  "started-minimize": boolean;
  "auto-continue": boolean;
  "default-storage-path": string;
  secret: string;
  "max-connection-per-server": number;
  "max-concurrent-downloads": number;
  "user-agent": string;
  "download-redirect": boolean;
};

/** ---------------------------
 * 全局对象声明
 * --------------------------- */
declare global {
  interface Window {
    $__aria2: Aria2Api;
    $http: <T = any>(req: HttpRequest) => Promise<HttpResponse<T>>;
    $__electron: {
      selectDirectory(): Promise<string | null>;
      getVersion(): Promise<string>;
      openLink(link: string): Promise<void>;
    };
    $__store: {
      get<K extends keyof AppStoreSchema>(key: K): Promise<AppStoreSchema[K]>;
    };
  }
}
```
:::


## window.$__electron

`$__electron` 对象提供了与 Electron 相关的功能，允许扩展访问系统级操作。

### `selectDirectory`

调用系统选择文件夹对话框，返回用户选择的目录路径。

**用法示例：**
```typescript [example.ts]
const selectedPath = await $__electron.selectDirectory();
console.log('用户选择的目录:', selectedPath);
```

### `getVersion`

获取当前 Vortex 应用的版本信息。

**用法示例：**
```typescript [example.ts]
const version = $__electron.getVersion();
console.log('Vortex 版本:', version);
```

### `openLink`

在默认浏览器中打开指定链接。内部实现为 `electron.shell.openExternal`。

**参数：**
- `url` (string): 要打开的链接地址

**用法示例：**
```typescript [example.ts]
$__electron.openLink('https://docs.f4team.cn/vortex');
```

## window.$http

`$http` 对象提供了 HTTP 请求功能，允许扩展与外部服务进行通信。

### 使用方法

`$http` 接受一个 `HttpRequest` 对象作为参数，返回一个 `Promise<HttpResponse<T>>`。

**HttpRequest 参数：**
- `method` (string): HTTP 方法（GET, POST, PUT, DELETE 等）
- `url` (string): 请求地址
- `data` (any, 可选): 请求数据
- `config` (AxiosRequestConfig, 可选): Axios 请求配置

**HttpResponse 返回值：**
- `data` (T, 可选): 响应数据
- `status` (number): HTTP 状态码
- `error` (string, 可选): 错误信息
- `headers` (AxiosResponseHeaders, 可选): 响应头

**用法示例：**
```typescript [example.ts]
// GET 请求
const response = await $http({
  method: 'GET',
  url: 'https://api.example.com/data'
});
console.log(response.data);

// POST 请求
const postResponse = await $http({
  method: 'POST',
  url: 'https://api.example.com/data',
  data: { key: 'value' }
});
console.log(postResponse.data);

// 带配置的请求
const configResponse = await $http({
  method: 'POST',
  url: 'https://api.example.com/data',
  data: { key: 'value' },
  config: {
    headers: { 'Content-Type': 'application/json' }
  }
});
console.log(configResponse.data);
```

## window.$__store

`$__store` 对象提供了对 Vortex 配置存储的访问，允许扩展读取配置数据。

### `get`

获取指定键的配置值。

**参数：**
- `key` (string): 配置键名
- `defaultValue` (any, 可选): 默认值，当键不存在时返回

**用法示例：**
```typescript [example.ts]
const value = $__store.get('aria2-args');
console.log('配置值:', value);
```

## window.$__aria2

`$__aria2` 对象提供了与 Aria2 下载器交互的功能，允许扩展通过 RPC 协议控制下载任务。

### 类型详解

#### Aria2RPCRequest

Aria2RPCRequest 类型定义了发送给 Aria2 的单个 RPC 请求的结构。

**属性说明：**
- `jsonrpc` (string, 可选): JSON-RPC 版本，通常为 "2.0"
- `method` (string): 要调用的 Aria2 方法名，如 "aria2.addUri"、"aria2.tellActive" 等
- `id` (string | number | null, 可选): 请求标识符，用于匹配响应
- `params` (T, 可选): 传递给方法的参数数组

#### Aria2RPCResponse

Aria2RPCResponse 类型定义了从 Aria2 返回的 RPC 响应的结构。

**属性说明：**
- `jsonrpc` (string): JSON-RPC 版本，通常为 "2.0"
- `id` (string, 可选): 与请求中的 id 对应，用于匹配响应
- `method` (string, 可选): 响应对应的方法名
- `result` (T, 可选): 方法调用成功时的返回结果
- `error` (object, 可选): 方法调用失败时的错误信息
  - `code` (number): 错误代码
  - `message` (string): 错误描述

#### Aria2RPCMultiCallRequest

Aria2RPCMultiCallRequest 类型定义了批量 RPC 请求的结构，允许在单个请求中发送多个不同的方法调用。

**结构说明：**
- 这是一个数组，每个元素代表一个方法调用
- 每个元素包含：
  - `methodName` (string): 要调用的 Aria2 方法名
  - `params` (any, 可选): 传递给方法的参数

### API 方法

#### `call`

发送单个 Aria2 RPC 请求。

**参数：**
- `request` (Aria2RPCRequest): RPC 请求对象

**返回值：**
- `Promise<Aria2RPCResponse>`: RPC 响应对象

**用法示例：**
```typescript [example.ts]
const response = await $__aria2.call({
  method: 'aria2.getVersion',
  id: '1'
});
console.log(response.result);
```

#### `multiCall`

发送多个 Aria2 RPC 请求。

**参数：**
- `request` (Aria2RPCMultiCallRequest): 多个 RPC 请求的数组

**返回值：**
- `Promise<Aria2RPCResponse>`: RPC 响应对象

**用法示例：**
```typescript [example.ts]
const response = await $__aria2.multiCall([
  { methodName: 'aria2.getVersion' },
  { methodName: 'aria2.getSessionInfo' }
]);
console.log(response.result);
```

#### `send`

发送 Aria2 RPC 请求并返回原始响应字符串。

**参数：**
- `request` (Aria2RPCRequest): RPC 请求对象

**返回值：**
- `Promise<string>`: 原始响应字符串

**用法示例：**
```typescript [example.ts]
const response = await $__aria2.send({
  method: 'aria2.getVersion',
  id: '1'
});
console.log(response);
```

#### `newTask`

创建新的下载任务。

::: danger 重要提醒

在添加下载任务时，请务必使用 `$__aria2.newTask` 方法，而不是 `airai2.addUri`。
:::

**参数：**
- `request` (NewTaskBuilder): 新任务构建参数
  - `links` (string): 下载链接
  - `filename` (string): 文件名
  - `split` (number, 可选): 分片数量
  - `storagePath` (string, 可选): 存储路径
  - `userAgent` (string, 可选): 用户代理
  - `cookie` (string, 可选): Cookie
  - `referer` (string, 可选): 引用页
  - `headers` (Array<{ key: string; value: string }>, 可选): 请求头

**返回值：**
- `Promise<Aria2RPCResponse>`: RPC 响应对象

**用法示例：**
```typescript [example.ts]
const response = await $__aria2.newTask({
  links: 'https://example.com/file.zip',
  filename: 'file.zip',
  split: 5
});
console.log(response.result);
```