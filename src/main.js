import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import router from './router'
import store from './store/index'
import 'element-plus/dist/index.css'
import App from './App.vue'
import './common/style/index.scss'

const app = createApp(App)

app.use(ElementPlus)
app.use(router)
app.use(store)
app.mount('#app')