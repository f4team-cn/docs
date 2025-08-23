# HTTP API 文档

## 概述

Vortex 提供了一个本地 HTTP 服务器，用于接收外部请求并执行相应的操作。该服务器在应用启动时自动启动，监听一个可用的端口（51220-51225范围内的端口）。

通过这个 HTTP API，外部应用程序可以与 Vortex 进行交互，例如创建新的下载任务等。

## 请求验证

为了安全起见，服务器会对每个请求进行验证，只接受来自指定主机和用户代理的请求。服务器会检查请求的Host头和User-Agent头，确保它们符合预设的安全标准。只有通过验证的请求才会被处理，未通过验证的请求将返回418状态码。

### 验证要求

1. 请求的主机必须是 `localhost.vortex.f4team.cn`
2. 请求的用户代理必须是 `vortex-acme/1.0`

## API 端点

### 创建新任务

通过此端点可以创建新的下载任务。

- **URL**: `/new-task`
- **方法**: `POST`
- **Content-Type**: `application/json`

#### 请求体

NewTaskBuilder 类型定义如下:

```typescript
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
```

其中 `links` 字段是一个字符串，每行包含一个下载链接。

基于此类型定义，一个基本的请求体示例为：

```json
{
  "links": "https://example.com/file1.zip\nhttps://example.com/file2.zip",
  "filename": "my-downloads"
}
```

如果需要更复杂的配置，可以包含更多字段：

```json
{
  "links": "https://example.com/file1.zip",
  "filename": "special-download",
  "split": 4,
  "userAgent": "CustomUserAgent/1.0",
  "cookie": "session=abc123",
  "referer": "https://referer.com",
  "headers": [
    { "key": "Authorization", "value": "Bearer token123" },
    { "key": "X-Custom-Header", "value": "custom-value" }
  ]
}
```

#### curl 示例

使用curl创建一个简单的下载任务：

```bash
curl -X POST "http://localhost.vortex.f4team.cn:51220/new-task" \
     -H "User-Agent: vortex-acme/1.0" \
     -H "Content-Type: application/json" \
     -d '{"links":"https://example.com/file1.zip\nhttps://example.com/file2.zip","filename":"my-downloads"}'
```

使用curl创建一个复杂配置的下载任务：

```bash
curl -X POST "http://localhost.vortex.f4team.cn:51220/new-task" \
     -H "User-Agent: vortex-acme/1.0" \
     -H "Content-Type: application/json" \
     -d '{"links":"https://example.com/file1.zip","filename":"special-download","split":4,"userAgent":"CustomUserAgent/1.0","cookie":"session=abc123","referer":"https://referer.com","headers":[{"key":"Authorization","value":"Bearer token123"},{"key":"X-Custom-Header","value":"custom-value"}]}'
```

#### 响应

- **成功**: `201 Created`
- **请求体无效**: `400 Bad Request`
- **验证失败**: `418 I'm a teapot`
