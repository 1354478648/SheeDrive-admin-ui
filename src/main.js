import './assets/main.scss'

import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { createPinia } from 'pinia'
const pinia = createPinia()
import router from '@/router'
import { createPersistedState } from 'pinia-persistedstate-plugin'

const app = createApp(App)

// 取消控制台中的警告
app.config.warnHandler = () => null

// pinia持久化存储
const persist = createPersistedState()

// ElementPlus中文包
app.use(ElementPlus, {
    locale: zhCn,
})

// 注册 icon 图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.use(pinia)
app.use(router)
pinia.use(persist)
app.mount('#app')