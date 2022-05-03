import { createRouter,createWebHashHistory } from 'vue-router'

const routes = [{
    path:'/',
    name:'Login',
    component: () => import('../views/login/Login')
},{
    path:'/Home',
    name:'Home',
    component: () => import('../views/Home/Home'),
    children:[{
        path:'/users',
        name:'Users',
        component: () => import('../views/Users/users'),
    },{
        path:'/roles',
        name:'Roles',
        component: () => import('../views/Power/roles'),
    },{
        path:'/rights',
        name:'Rights',
        component: () => import('../views/Power/rights'),
    },{
        path:'/goods',
        name:'Goods',
        component: () => import('../views/Goods/goods'),
    },{
        path:'/goods/add',
        name:'Add',
        component: () => import('../views/Goods/add'),
    },{
        path:'/params',
        name:'Params',
        component: () => import('../views/Goods/classify/params'),
    },{
        path:'/categories',
        name:'Categories',
        component: () => import('../views/Goods/categories'),
    },{
        path:'/Orders',
        name:'Orders',
        component: () => import('../views/Orders/Orders'),
    },{
        path:'/Reports',
        name:'Reports',
        component: () => import('../views/Reports/Reports'),
    }]
}]

const router = createRouter({
    history:createWebHashHistory(),
    routes
})

export default router