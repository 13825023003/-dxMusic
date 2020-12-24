import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [{
        path: '/welcome',
        name: 'Welcome',
        component: () =>
            import ('../views/Welcome.vue')
    }, {
        path: '/login',
        name: 'Login',
        component: () =>
            import ('../views/Login.vue')
    }, {
        path: '/forget',
        name: 'Forget',
        component: () =>
            import ('../views/Forget.vue')
    }, {
        path: '/register',
        name: 'Register',
        component: () =>
            import ('../views/Register.vue')
    },
    {
        path: '/like',
        name: 'Like',
        component: () =>
            import ('../views/Like.vue')
    },
    {
        path: '/account',
        name: 'Account',
        component: () =>
            import ('../views/Account.vue')
    },
    {
        path: '/collection',
        name: 'Collection',
        component: () =>
            import ('../views/Collection.vue')
    },
    {
        path: '/secure',
        name: 'Secure',
        component: () =>
            import ('../views/Secure.vue')
    },
    {
        path: '/artists/:id/:name?/:pic?/:songCount?/:albumCount?/',
        name: 'Artists',
        component: () =>
            import ('../views/Artists.vue')
    },
    {
        path: '/search',
        name: 'Search',
        component: () =>
            import ('../views/Search.vue')
    },
    {
        path: '/cd/:id/:name?/:img?/:playCount?/:nickname?/:avatarUrl?/',
        name: 'CD',
        component: () =>
            import ('../views/CD.vue')
    },
    {
        path: '/searchResult/:searchvalue',
        name: 'SearchResult',
        component: () =>
            import ('../views/SearchResult.vue')
    },
    {
        path: '/detail/:id/:name?/:index?/:time?/:like?',
        name: 'Detail',
        component: () =>
            import ('../views/Detail.vue')
    }, {
        path: '/main',
        name: 'Main',
        component: () =>
            import ('../views/Main.vue'),
        // 二级路由配置
        children: [{
            path: '/home',
            name: 'Home',
            component: () =>
                import ('../views/Home.vue'),
            // 三级路由配置
            children: [{
                path: 'recommend',
                name: 'Recommend',
                component: () =>
                    import ('../views/Recommend.vue')
            }, {
                path: 'classify',
                name: 'Classify',
                component: () =>
                    import ('../views/Classify.vue')
            }, ]
        }, {
            path: '/circleTalk',
            name: 'CircleTalk',
            component: () =>
                import ('../views/CircleTalk.vue')
        }, {
            path: '/list',
            name: 'List',
            component: () =>
                import ('../views/List.vue')
        }, {
            path: '/my',
            name: 'My',
            component: () =>
                import ('../views/My.vue')
        }, ]
    }, {
        path: '*',
        redirect: {
            name: 'Welcome'
        }
    }

]

const router = new VueRouter({
    routes
})

export default router