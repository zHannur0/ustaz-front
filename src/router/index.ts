import { createRouter, createWebHistory } from 'vue-router'
import {loadLayoutMiddleware} from "./middleware/loadLayoutMiddleware.ts";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/home',
            name: 'home',
            meta: {
                layout: 'MainLayout',
            },
            component:  () => import("@/modules/home/Home.vue"),
        }
    ]
})

router.beforeEach(loadLayoutMiddleware)

export default router