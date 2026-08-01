import routes from './routes.js';
import AppHeader from './header.js';

const app = Vue.createApp({});

app.component('app-header', AppHeader);

const router = VueRouter.createRouter({
    history: VueRouter.createWebHashHistory(),
    routes,
});

app.use(router);
app.mount('#app');