/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const peopleRouter = {
    path: '/people',
    component: Layout,
    redirect: '/people/user/list',
    alwaysShow: true,
    name: 'People',
    meta: {
        title: 'People',
        icon: 'peoples',
        roles: ['admin']
    },
    children: [
        {
            path: 'user',
            component: () => import('@/views/people'),
            redirect: 'people/user/list',
            name: 'User',
            meta: {
                title: 'User',
            },
            children: [
                {
                    path: 'list',
                    component: () => import('@/views/people/user/list-user'),
                    name: 'List User',
                    meta: {
                        title: 'List User',
                    }
                },
                {
                    path: 'add',
                    component: () => import('@/views/people/user/add-user'),
                    name: 'Add User',
                    meta: {
                        title: 'Add User'
                    }
                },
                {
                    path: 'user-type',
                    component: () => import('@/views/people'),
                    redirect: 'user/user-type/list',
                    name: 'User Type',
                    meta: {
                        title: 'User Type',
                    },
                    children: [
                        {
                            path: 'list',
                            component: () => import('@/views/people/user/user-type/list-user-type'),
                            name: 'List User Type',
                            meta: {
                                title: 'List User Type'
                            }
                        },
                        {
                            path: 'add',
                            component: () => import('@/views/people/user/user-type/add-user-type'),
                            name: 'Add User Type',
                            meta: {
                                title: 'Add User Type'
                            }
                        }
                    ]
                },
            ],
        },
        {
            path: 'supplier',
            component: () => import('@/views/people'),
            redirect: 'people/supplier/list',
            name: 'Supplier',
            meta: {
                title: 'Supplier',
            },
            children: [
                {
                    path: 'list',
                    component: () => import('@/views/people/supplier/list-supplier'),
                    name: 'List Supplier',
                    meta: {
                        title: 'List Supplier',
                    }
                },
                {
                    path: 'add',
                    component: () => import('@/views/people/supplier/add-supplier'),
                    name: 'Add Supplier',
                    meta: {
                        title: 'Add Supplier'
                    }
                }
            ],
        },
        {
            path: 'customer',
            component: () => import('@/views/people'),
            redirect: 'people/customer/list',
            name: 'Customer',
            meta: {
                title: 'Customer',
            },
            children: [
                {
                    path: 'list',
                    component: () => import('@/views/people/customer/list-customer'),
                    name: 'List Customer',
                    meta: {
                        title: 'List Customer',
                    }
                },
                {
                    path: 'add',
                    component: () => import('@/views/people/customer/add-customer'),
                    name: 'Add Customer',
                    meta: {
                        title: 'Add Customer'
                    }
                }
            ],
        },
    ]
}

export default peopleRouter
