/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const inventoryRouter = {
    path: '/inventory',
    component: Layout,
    redirect: '/inventory/list',
    alwaysShow: true,
    name: 'Inventory',
    meta: {
        title: 'Inventory',
        icon: 'list',
        roles: ['admin', 'manager']
    },
    children: [
        {
            path: 'list',
            component: () => import('@/views/inventory/list-inventory'),
            name: 'List Inventory',
            meta: {
                title: 'List Inventory'
            }
        },
    ]
}

export default inventoryRouter
