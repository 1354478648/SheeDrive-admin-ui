# 小羊试驾A/B端 SheeDrive-admin-ui 开发文档

<img src="/src/assets/SheeDrive_logo_title.png" width="80%" height="auto">

> 本文档建立于 2024-02-17

## 快速体验
0. 准备`node`与`npm`的开发环境

1. 从 github 克隆项目代码到你的工作目录下
```bash
# https
git clone https://github.com/1354478648/SheeDrive-admin-ui.git
# ssh
git clone git@github.com:1354478648/SheeDrive-admin-ui.git
```
2. 安装依赖包，任何包管理器都可以，以下以`npm`为例
```bash
cd SheeDrive-admin-ui
npm install
```
3. 运行项目
```bash
# Windows
npm run dev
```

4. 根据终端中打印的提示，打开浏览器，访问 http://localhost:5173

- tips: 
1. 如启动失败，请通过 node -v 检查 Node 版本是否在 16+ 以上。
2. 小羊试驾采用前后端分离的架构设计，因此本前端项目必须保证后端接口的开放才能正常使用。