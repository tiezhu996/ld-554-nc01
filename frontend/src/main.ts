import { createApp } from 'vue';
import { createPinia } from 'pinia';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import App from './App.vue';
import router from './router';
import './styles/global.scss';
import type { UserRoleValue } from './constants/enums';

const app = createApp(App);

app.directive('permission', {
  mounted(el, binding: { value: UserRoleValue[] }) {
    const raw = localStorage.getItem('user');
    const user = raw ? JSON.parse(raw) : null;
    if (!user || !binding.value.includes(user.role)) el.remove();
  }
});

app.use(createPinia());
app.use(router);
app.use(ElementPlus);
app.mount('#app');
