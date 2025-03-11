# 📝 日记本应用 (Diary App)

<div align="center">
  <img src="https://img.shields.io/badge/vue.js-v3.2.45-4FC08D?style=flat-square&logo=vue.js" alt="Vue.js" />
  <img src="https://img.shields.io/badge/license-MIT-blue?style=flat-square" alt="License" />
  <img src="https://img.shields.io/badge/PRs-welcome-brightgreen?style=flat-square" alt="PRs Welcome" />
</div>

<div align="center">
  <img src="src/assets/logo.svg" width="100" height="100" alt="日记本应用" />
</div>

<p align="center">一个基于Vue.js开发的现代化日记应用，帮助用户记录和管理日常生活中的点滴。界面优雅，功能丰富，支持多种方式浏览和管理您的个人日记。</p>

## ✨ 功能特点

### 核心功能
- **📝 日记管理**：创建、编辑、删除和查看日记，支持富文本编辑
- **📅 日历视图**：通过日历快速浏览和访问不同日期的日记
- **📊 数据分析**：情绪、标签统计和写作习惯分析，帮助了解自己的情绪变化
- **🔍 智能搜索**：根据标题、内容、日期、标签或情绪快速找到日记

### 用户体验
- **🌈 情绪追踪**：记录每篇日记时的心情，随时追踪情绪变化
- **🏷️ 标签系统**：使用自定义标签对日记进行分类和组织
- **🔔 提醒功能**：设置写日记提醒，养成记录习惯
- **🔒 隐私保护**：支持设置密码保护重要日记

### 技术特点
- **📱 响应式设计**：完美适配手机、平板和桌面设备
- **🚀 离线支持**：无需网络连接也能使用主要功能
- **🎨 主题自定义**：支持明暗主题切换和颜色个性化
- **🔄 数据同步**：支持多设备数据同步（通过API）

## 🖥️ 技术栈

- **前端框架**: Vue 3 + Composition API
- **路由管理**: Vue Router 4
- **UI组件**: 自定义组件 + FontAwesome图标
- **HTTP客户端**: Fetch API
- **构建工具**: Vite
- **CSS预处理**: 原生CSS（采用变量和模块化设计）
- **代码规范**: ESLint + Prettier

## 📸 应用截图

<div align="center">
  <table>
    <tr>
      <td><strong>首页</strong></td>
      <td><strong>日记编辑</strong></td>
      <td><strong>日历视图</strong></td>
    </tr>
    <tr>
      <td><em>日记列表展示</em></td>
      <td><em>编辑日记内容</em></td>
      <td><em>日历形式浏览</em></td>
    </tr>
  </table>
</div>

## 🚀 快速开始

### 安装依赖

```bash
# 克隆项目
git clone https://github.com/boldiy/diary-ai-vue.git
cd diary-ai-vue

# 安装依赖
npm install
```

### 开发环境运行

```bash
# 启动开发服务器
npm run dev
```

### 生产环境构建

```bash
# 构建生产版本
npm run build

# 预览生产版本
npm run preview
```

## 📁 项目结构

```
diary-ai-vue/
├── public/              # 静态资源文件
├── src/
│   ├── assets/          # 资源文件(CSS、图片等)
│   │   ├── css/         # CSS文件
│   │   │   └── styles.css  # 全局样式
│   │   └── images/      # 图片资源
│   ├── components/      # 可复用组件
│   │   ├── DiaryCard.vue   # 日记卡片组件
│   │   └── NavBar.vue      # 导航栏组件
│   ├── router/          # 路由配置
│   │   └── index.js     # 路由定义
│   ├── services/        # API服务
│   │   ├── auth.js      # 认证服务
│   │   └── diary.js     # 日记API服务
│   ├── views/           # 页面组件
│   │   ├── HomeView.vue    # 首页
│   │   ├── EditView.vue    # 日记编辑页
│   │   └── ...
│   ├── App.vue          # 根组件
│   └── main.js          # 应用入口
├── .gitignore           # Git忽略文件
├── index.html           # HTML模板
├── package.json         # 项目配置
├── README.md            # 项目说明
└── vite.config.js       # Vite配置
```

## 🔌 API文档

本应用使用RESTful API进行数据交互。主要端点如下：

### 日记相关API

| 端点 | 方法 | 描述 | 参数 |
|------|------|------|------|
| `/api/diaries` | GET | 获取所有日记 | `?page=1&limit=10` |
| `/api/diaries/:id` | GET | 获取单篇日记 | - |
| `/api/diaries` | POST | 创建新日记 | title, content, date_value, mood, tags |
| `/api/diaries/:id` | PUT | 更新日记 | title, content, date_value, mood, tags |
| `/api/diaries/:id` | DELETE | 删除日记 | - |
| `/api/diaries/date/:date` | GET | 获取特定日期的日记 | - |

### 用户认证API

| 端点 | 方法 | 描述 | 参数 |
|------|------|------|------|
| `/api/auth/register` | POST | 用户注册 | username, email, password |
| `/api/auth/login` | POST | 用户登录 | email, password |
| `/api/auth/logout` | POST | 用户登出 | - |

## 🧑‍💻 开发者指南

### 代码贡献流程

1. Fork本仓库
2. 创建您的特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交您的更改 (`git commit -m '添加了一些很棒的功能'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 提交Pull Request

### 编码规范

- 使用ESLint + Prettier进行代码格式化
- Vue组件使用PascalCase命名
- 使用语义化的变量和函数命名
- 每个组件保持单一职责，复杂组件进行拆分

## 🔜 未来计划

- [ ] 添加富文本编辑器支持
- [ ] 实现多语言支持
- [ ] 开发桌面应用版本
- [ ] 添加数据导出/导入功能
- [ ] 集成AI辅助写作功能
- [ ] 添加更多数据可视化图表

## 📄 许可证

本项目采用MIT许可证 - 详情请查看 [LICENSE](LICENSE) 文件

## 🙏 致谢

- 感谢所有开源项目的贡献者
- 特别感谢Vue.js团队提供的优秀框架
- 感谢所有提供反馈和建议的用户

---

<p align="center">Made with ❤️ by <a href="https://github.com/boldiy">boldiy</a></p>
