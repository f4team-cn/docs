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

export type Aria2TaskBuilder = {
  links: string;
  filename: string;
  split?: number;
  storagePath: string;
  userAgent?: string;
  cookie?: string;
  referer?: string;
  headers?: { key: string; value: string }[];
  silent?: boolean;
  extra?: Record<string, unknown>;
};

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

declare type AppApiType = {
  getVersion: () => Promise<string>;
};

declare type HttpFunctionType = <T>(request: HttpRequest) => Promise<HttpResponse<T>>;

declare type ProviderCoreApiType = {
  newTask: (builder: Aria2TaskBuilder) => Promise<boolean>;
  getCurrentLanguage: () => Promise<string>;
  getConfig: (key: keyof AppStoreSchema) => Promise<AppStoreSchema[keyof AppStoreSchema]>;
};

/** ---------------------------
 * 全局对象声明
 * --------------------------- */
declare global {
  interface Window {
    $http: HttpFunctionType;
    $provider: ProviderCoreApiType;
    $app: AppApiType;
  }
}
```
:::

## 核心 API 概述

Vortex 提供了三个核心 API 对象，用于扩展与主应用的交互：

| API 对象 | 主要功能 |
|----------|----------|
| `window.$provider` | 下载任务管理、应用配置获取 |
| `window.$app` | 应用信息获取 |
| `window.$http` | HTTP 请求处理 |

---

## window.$provider

`$provider` 对象提供了 Vortex Provider 的核心功能，主要用于创建下载任务和获取应用配置。

### `newTask`

创建一个新的下载任务。

#### Android 平台支持

在 Android 中生效的 `Aria2TaskBuilder` 参数：
- `links`
- `filename`
- `storagePath`
- `userAgent`
- `cookie`
- `referer`
- `headers`

#### 参数
- `request` (`Aria2TaskBuilder`): 新任务参数构建对象

#### 返回值
- `Promise<boolean>`: 是否创建成功

#### 用法示例
```typescript [example.ts]
await window.$provider.newTask({
  links: 'https://example.com/file.zip',
  filename: 'file.zip',
  storagePath: './Downloads', // 保存路径，基于 Vortex 设置的保存路径，在 Android 上可能不会生效
  userAgent: 'Mozilla/5.0 (compatible; Vortex)',
  headers: [
    { key: 'Authorization', value: 'Bearer token' },
    { key: 'X-Custom-Header', value: 'custom-value' }
  ]
});
```

### `getCurrentLanguage`

获取当前 Vortex 应用的语言设置。

#### 返回值
- `Promise<string>`: 当前语言设置（如 "zh-CN"）

#### 用法示例
```typescript [example.ts]
const language = await window.$provider.getCurrentLanguage();
console.log('当前语言:', language);
```

### `getConfig`

获取当前 Vortex 应用的配置信息。

::: warning Android 平台限制
在 Android 中，仅有 `language` 和 `default-storage-path` 为实际值，其他配置项均为默认值（string => '', number => 0, boolean => false）。
:::

#### 参数
- `key` (keyof AppStoreSchema): 配置项键名

#### 返回值
- `Promise<AppStoreSchema[keyof AppStoreSchema]>`: 对应配置项的值

#### 用法示例
```typescript [example.ts]
// 获取当前语言设置
const language = await window.$provider.getConfig('language');
console.log('当前语言:', language);

// 获取默认存储路径
const storagePath = await window.$provider.getConfig('default-storage-path');
console.log('默认存储路径:', storagePath);
```

---

## window.$app

`$app` 对象提供了 Vortex 的相关信息和功能。

### `getVersion`

获取当前 Vortex 应用的版本信息。

#### 返回值
- `Promise<string>`: Vortex 版本号

#### 用法示例
```typescript [example.ts]
const version = await window.$app.getVersion();
console.log('Vortex 版本:', version);
```

---

## window.$http

`$http` 对象提供了 HTTP 请求功能，允许扩展与外部服务进行通信。

### 使用方法

`$http` 接受一个 `HttpRequest` 对象作为参数，返回一个 `Promise<HttpResponse<T>>`。

#### HttpRequest 参数
- `method` (string): HTTP 方法（GET, POST, PUT, DELETE 等）
- `url` (string): 请求地址
- `data` (any, 可选): 请求数据
- `config` (AxiosRequestConfig, 可选): Axios 请求配置

#### HttpResponse 返回值
- `data` (T, 可选): 响应数据
- `status` (number): HTTP 状态码
- `error` (string, 可选): 错误信息
- `headers` (AxiosResponseHeaders, 可选): 响应头

#### 注意事项
- 对于 Android 端，Axios 的部分配置不支持，经过测试，以下示例均可使用。

#### 用法示例
```typescript [example.ts]
// GET 请求
try {
  const response = await window.$http({
    method: 'GET',
    url: 'https://api.example.com/data'
  });
  console.log(response.data);
} catch (error) {
  console.error('请求失败:', error);
}

// POST 请求
try {
  const postResponse = await window.$http({
    method: 'POST',
    url: 'https://api.example.com/data',
    data: { key: 'value' }
  });
  console.log(postResponse.data);
} catch (error) {
  console.error('请求失败:', error);
}

// 带配置的请求
try {
  const configResponse = await window.$http({
    method: 'POST',
    url: 'https://api.example.com/data',
    data: { key: 'value' },
    config: {
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': 'Bearer your-token-here'
      }
    }
  });
  console.log(configResponse.data);
} catch (error) {
  console.error('请求失败:', error);
}
```

### 错误处理最佳实践

在使用 `$http` API 时，建议始终使用 try-catch 进行错误处理：

```typescript [example.ts]
async function fetchData() {
  try {
    const response = await window.$http({
      method: 'GET',
      url: 'https://api.example.com/data'
    });
    
    if (response.status >= 200 && response.status < 300) {
      return response.data;
    } else {
      throw new Error(`HTTP Error: ${response.status}`);
    }
  } catch (error) {
    console.error('API 请求失败:', error.message || error);
    throw error;
  }
}
```
