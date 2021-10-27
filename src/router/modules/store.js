/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const storeRouter = {
    path: '/store',
    component: Layout,
    redirect: '/store/list',
    alwaysShow: true,
    name: 'Store',
    meta: {
        title: 'Store',
        icon: 'store',
        roles: ['admin', 'manager']
    },
    children: [
        {
            path: 'list',
            component: () => import('@/views/store/list-store'),
            name: 'List store',
            meta: {
                title: 'List store'
            }
        },
        {
            path: 'add',
            component: () => import('@/views/store/add-store'),
            name: 'Add store',
            meta: {
                title: 'Add store'
            }
        }
    ]
}

export default storeRouter
