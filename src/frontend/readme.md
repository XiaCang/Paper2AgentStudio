# Scider Frontend

Scider 项目的前端部分，基于 **Vue 3**、**Vite** 和 **TypeScript** 构建。

## 🚀 快速开始

在开始之前，请确保您的本地环境已安装 [Node.js](https://nodejs.org/)。

### 1. 安装依赖
建议使用 `pnpm` 或 `npm` 进行安装：
```bash
npm install
# 或者
pnpm install
```

### 2. 启动开发服务器
```bash
npm run dev
```

### 3. 打包
```bash
npm run build
```

## 📚 目录结构说明

```txt
src/
├── api/            # API 接口定义，按模块管理请求函数
├── assets/         # 静态资源，如图片、字体、图标等
├── components/     # 公共业务组件，可复用的 UI 单元
├── layouts/        # 页面布局组件（如侧边栏、顶部栏容器）
├── network/        # 网络请求配置，通常包含 Axios 拦截器与实例封装
├── router/         # 路由配置中心 (Vue Router)
├── store/          # 状态管理库 (Pinia / Vuex)
├── types/          # TypeScript 类型定义文件 (*.d.ts)
├── utils/          # 公共工具函数（日期处理、格式验证等）
├── views/          # 页面级组件，与路由直接对应的完整视图
├── App.vue         # 根组件，所有页面的入口容器
├── main.ts         # 项目入口文件，初始化 Vue 实例与插件
├── base.css        # 基础样式重置
├── app-theme.css   # 应用全局主题样式
├── theme.css       # 动态/备选主题变量配置
└── style.css       # 通用全局样式
```

## 🛠️ 技术栈

框架: Vue 3 (Composition API)
构建工具: Vite
编程语言: TypeScript
路由: Vue Router
状态管理: Pinia
样式: CSS

## 📝 开发规范

**组件命名**: 统一采用 PascalCase 命名法，例如 UserCard.vue。

**API 调用**: 严禁在视图层直接写请求逻辑，应在 api/ 定义后再引入。

**类型安全**: 新增复杂数据结构时，请在 types/ 目录下定义接口 (Interface)。