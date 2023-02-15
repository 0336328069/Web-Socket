import { createWebHistory, createRouter } from "vue-router";
const Login = () => import("@/views/Login.vue");
const Homepage = () => import("@/views/Homepage.vue");
const routes = [
    {
        path: "/",
        name: "Home",
        component: Homepage
    },
    {
        path: "/login",
        name: "login",
        component: Login
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;