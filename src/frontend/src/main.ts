import { createApp } from 'vue'
import { pinia } from './store'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import App from './App.vue'
import router from './router' 
import './style.css'
import './base.css'

const app = createApp(App)


for (const [name, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(name, component)
}

app.use(pinia)          
app.use(router)         
app.use(ElementPlus)    

app.mount('#app')
