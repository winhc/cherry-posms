/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const productRouter = {
    path: '/product',
    component: Layout,
    redirect: '/product/list',
    alwaysShow: true,
    name: 'Product',
    meta: {
        title: 'Product',
        icon: 'component',
        roles: ['admin', 'manager', 'accountant']
    },
    children: [
        {
            path: 'list',
            component: () => import('@/views/product/list-product'),
            name: 'List Product',
            meta: {
                title: 'List Product'
            }
        },
        {
            path: 'add',
            component: () => import('@/views/product/add-product'),
            name: 'Add Product',
            meta: {
                title: 'Add Product'
            }
        },
        {
            path: 'category',
            component: () => import('@/views/product'),
            redirect: 'product/category/list',
            name: 'Category',
            meta: {
                title: 'Category',
                roles: ['admin', 'manager', 'accountant']
            },
            children: [
                {
                    path: 'list',
                    component: () => import('@/views/category/list-category'),
                    name: 'List Category',
                    meta: {
                        title: 'List Category'
                    }
                },
                {
                    path: 'add',
                    component: () => import('@/views/category/add-category'),
                    name: 'Add Category',
                    meta: {
                        title: 'Add Category'
                    }
                }
            ]
        },
        {
            path: 'brand',
            component: () => import('@/views/product'),
            redirect: 'product/brand/list',
            name: 'Brand',
            meta: {
                title: 'Brand',
                roles: ['admin', 'manager', 'accountant']
            },
            children: [
                {
                    path: 'list',
                    component: () => import('@/views/brand/list-brand'),
                    name: 'List Brand',
                    meta: {
                        title: 'List Brand'
                    }
                },
                {
                    path: 'add',
                    component: () => import('@/views/brand/add-brand'),
                    name: 'Add Brand',
                    meta: {
                        title: 'Add Brand'
                    }
                }
            ]
        },
        {
            path: 'unit',
            component: () => import('@/views/product'),
            redirect: 'product/unit/list',
            name: 'Unit',
            meta: {
                title: 'Unit',
                roles: ['admin', 'manager', 'accountant']
            },
            children: [
                {
                    path: 'list',
                    component: () => import('@/views/product-type/list-product-type'),
                    name: 'List Unit',
                    meta: {
                        title: 'List Unit'
                    }
                },
                {
                    path: 'add',
                    component: () => import('@/views/product-type/add-product-type'),
                    name: 'Add Unit',
                    meta: {
                        title: 'Add Unit'
                    }
                }
            ]
        },
    ]
}

export default productRouter
