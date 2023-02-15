import { createApp } from 'vue'
import './style.css';
import "@/assets/app.css";
import VueRouter from "@/plugins/router";
import App from './App.vue';

const app = createApp(App);
app.use(VueRouter)
app.mount("#app");