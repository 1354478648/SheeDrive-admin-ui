import './assets/main.scss'

import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import router from '@/router'
import { createPinia } from 'pinia'
const pinia = createPinia()
import { createPersistedState } from 'pinia-persistedstate-plugin'

const app = createApp(App)
const persist = createPersistedState()
app.use(ElementPlus, {
    locale: zhCn,
})
// 注册 icon 图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.use(router)
app.use(pinia)
pinia.use(persist)
app.mount('#app')