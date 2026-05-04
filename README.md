# 云中医灵活用工与预约管理系统 (Cloud-TCM Service)

连接中医师与患者的 O2O 预约平台，解决医馆排班混乱及医师资质核验问题。

## 功能模块

### 医师端
- 在线申请入驻，多步骤表单
- 草稿保存与恢复
- 证书附件上传（支持进度显示）
- 排班管理

### 管理后台
- 医师资质审核
- 审核通过/驳回流程
- 驳回意见填写与反馈

### 患者端
- 医师列表展示
- 多维度筛选（科室、擅长领域）
- 动态排班展示与预约
- 预约记录管理

## 技术栈

- **前端框架**: Vue 3 + Composition API
- **UI 组件**: Element Plus
- **状态管理**: Pinia
- **路由**: Vue Router 4
- **HTTP 客户端**: Axios
- **构建工具**: Vite
- **日期处理**: Day.js

## 项目结构

```
src/
├── api/              # API 服务层
│   ├── index.js      # Axios 实例与拦截器
│   ├── doctor.js     # 医师相关接口
│   ├── appointment.js # 预约相关接口
│   └── upload.js     # 文件上传接口
├── assets/           # 静态资源
├── components/       # 通用组件
│   └── common/
│       ├── MainLayout.vue    # 主布局
│       ├── FileUpload.vue    # 文件上传组件
│       └── VirtualScroll.vue # 虚拟滚动组件
├── mock/             # Mock 数据
├── router/           # 路由配置
│   └── index.js      # 路由定义与权限守卫
├── stores/           # Pinia 状态管理
│   ├── auth.js       # 认证状态
│   ├── doctor.js     # 医师状态
│   └── appointment.js # 预约状态
├── utils/            # 工具函数
│   ├── permission.js # 权限控制
│   └── validate.js   # 表单验证
└── views/            # 页面视图
    ├── auth/         # 认证页面
    ├── doctor/       # 医师端页面
    ├── patient/      # 患者端页面
    └── admin/        # 管理后台页面
```

## 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

### 演示账号

| 角色 | 用户名 | 密码 |
|------|--------|------|
| 患者 | patient1 | 123456 |
| 医师 | doctor1 | 123456 |
| 管理员 | admin | 123456 |

## 核心功能实现

### RBAC 权限控制

基于角色的动态路由和菜单生成：
- 患者：医师列表、预约记录
- 医师：工作台、申请入驻、排班管理
- 管理员：管理首页、医师审核

### 状态机管理

预约状态流转：待就诊 → 已完成/已取消/已逾期

审核状态流转：审核中 → 已通过/已驳回

### 虚拟滚动优化

医师列表使用虚拟滚动技术，优化大量数据时的渲染性能。

### 预约冲突预校验

前端在提交预约前检查时段是否已被占用，减少无效的后端请求。
