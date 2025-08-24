# 🔐 授权 API

## 概述

本文档描述了OAuth2认证授权接口的使用方法，包括获取授权码、获取访问令牌、刷新令牌等标准OAuth2流程。

## 提前说明

所有OAuth2 API的请求域名为: [https://id.f4team.cn](https://id.f4team.cn)。

### 权限表

| 权限 | 描述 |
| --- | --- |
| `user:openid` | 获取用户OpenID |
| `user:simple` | 获取用户基础信息 |
| `user:profiles` | 获取用户资料 |

## 接口列表

### 1. 发起登录

- **URL**: `/oauth2/authorize`
- **方法**: `GET`
- **描述**: 发起登录请求，获取授权码。
- **参数**:
  - `client_id`: 应用的客户端ID。
  - `response_type`: 固定值 `code`。
  - `redirect_uri`: 重定向URI，必须与应用注册时的回调URI一致。
  - `scope`: 请求的权限范围。
  - `state`: 随机字符串，用于防止CSRF攻击。
- **示例**:
```http
GET /oauth2/authorize?client_id=oab7f63483c054262907689a57320f1f8&response_type=code&redirect_uri=http://example.com/callback&scope=user:openid,user:simple&state=123456
Host: id.f4team.cn
```

### 2. 获取访问令牌
- **URL**: `/api/oauth2/openapi/token`
- **方法**: `POST`
- **描述**: 使用授权码获取访问令牌。
- **参数**:
  - `client_id`: 应用的客户端ID。
  - `client_secret`: 应用的客户端密钥。
  - `grant_type`: 固定值 `authorization_code`。
  - `code`: 授权码。
- **示例**:
```http
GET /api/oauth2/openapi/token?grant_type=authorization_code&client_id=oab7f63483c054262907689a57320f1f8&client_secret=5CW~Qqjdna.&code=n9cm
Host: id.f4team.cn
```

### 3. 刷新访问令牌
- **URL**: `/api/oauth2/openapi/token`
- **方法**: `GET`
- **描述**: 使用刷新令牌获取新的访问令牌。
- **参数**:
  - `client_id`: 应用的客户端ID。
  - `client_secret`: 应用的客户端密钥。
  - `grant_type`: 固定值 `refresh_token`。
  - `refresh_token`: 刷新令牌。
- **示例**:
```http
GET /api/oauth2/openapi/token?client_id=oab7f63483c054262907689a57320f1f8&client_secret=5CW~Qqjdna.&grant_type=refresh_token&refresh_token=123456
Host: id.f4team.cn
```