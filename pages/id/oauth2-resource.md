# ⚙️ 资源 API

## 概述

本文档描述了OAuth2资源接口的使用方法，包括获取获取用户信息等接口。

## 提前说明

所有OAuth2 API的请求域名为: [https://id.f4team.cn](https://id.f4team.cn)。

本页面的所有接口均需要授权，授权方式为在请求头中添加 `Authorization` 字段，值为 `Bearer <access_token>`，其中 `<access_token>` 为获取到的访问令牌。

## OpenID 与 UnionID 说明

OpenID 是用户在星链账户中心的唯一标识符，每个用户都有一个唯一的 OpenID。同一用户在不同应用中获取的 OpenID 是相同的。开发者可以使用 OpenID 来识别用户身份。

UnionID 是用户在星链账户体系下的全局唯一标识符。当开发者拥有多个应用，并且这些应用需要识别同一用户时，应当使用 UnionID。与 OpenID 不同，UnionID 在所有应用中都是相同的。

如果开发者需要在多个应用之间识别同一用户，建议申请获取 UnionID 权限，而不是仅仅依赖 OpenID。

## 接口列表

### 1. 获取用户 OpenID

- **URL**: `/api/oauth2/v1/openapi/user/openid`
- **方法**: `GET`
- **描述**: 获取用户的OpenID。
- **权限**: `user:openid`
- **Header 参数**:
  - `Authorization`: `Bearer <access_token>`
- **示例**:
```http
GET /api/oauth2/v1/openapi/user/openid
Host: id.f4team.cn
Authorization: Bearer <access_token>
```

### 2. 获取用户 UnionID

- **URL**: `/api/oauth2/v1/openapi/user/unionid`
- **方法**: `GET`
- **描述**: 获取用户的 UnionID。
- **权限**: `user:unionid`
- **Header 参数**:
  - `Authorization`: `Bearer <access_token>`
- **示例**:
```http
GET /api/oauth2/v1/openapi/user/unionid
Host: id.f4team.cn
Authorization: Bearer <access_token>
```

### 3. 获取用户基础信息

- **URL**: `/api/oauth2/v1/openapi/user/simple`
- **方法**: `GET`
- **描述**: 获取用户的基础信息。
- **权限**: `user:simple` 和 `user:openid`
- **Header 参数**:
  - `Authorization`: `Bearer <access_token>`
- **示例**:
```http
GET /api/oauth2/v1/openapi/user/simple
Host: id.f4team.cn
Authorization: Bearer <access_token>
```

### 4. 获取用户资料

- **URL**: `/api/oauth2/v1/openapi/user/profiles`
- **方法**: `GET`
- **描述**: 获取用户的资料。
- **权限**: `user:profiles`
- **Header 参数**:
  - `Authorization`: `Bearer <access_token>`
- **示例**:
```http
GET /api/oauth2/v1/openapi/user/profiles
Host: id.f4team.cn
Authorization: Bearer <access_token>
```
