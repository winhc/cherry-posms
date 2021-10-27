/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const warehouseRouter = {
  path: '/warehouse',
  component: Layout,
  redirect: '/warehouse/product/list',
  alwaysShow: true,
  name: 'Warehouse',
  meta: {
    title: 'Warehouse',
    icon: 'warehouse',
    roles: ['admin']
  },
  children: [
    {
      path: 'product',
      component: () => import('@/views/warehouse'),
      redirect: 'warehouse/product/list',
      name: 'Product',
      meta: {
        title: 'Product',
        roles: ['admin', 'manager', 'accountant']
      },
      children: [
        {
          path: 'list',
          component: () => import('@/views/warehouse/product/list-product'),
          name: 'List Product',
          meta: {
            title: 'List Product'
          }
        },
        {
          path: 'add',
          component: () => import('@/views/warehouse/product/add-product'),
          name: 'Add Product',
          meta: {
            title: 'Add Product'
          }
        }
      ]
    },
    {
      path: 'category',
      component: () => import('@/views/warehouse'),
      redirect: 'warehouse/category/list',
      alwaysShow: true, // will always show the root menu
      name: 'Category',
      meta: {
        title: 'Category',
        roles: ['admin', 'manager', 'accountant']
      },
      children: [
        {
          path: 'list',
          component: () => import('@/views/warehouse/category/list-category'),
          name: 'List Category',
          meta: {
            title: 'List Category'
          }
        },
        {
          path: 'add',
          component: () => import('@/views/warehouse/category/add-category'),
          name: 'Add Category',
          meta: {
            title: 'Add Category'
          }
        }
      ]
    },
    {
      path: 'brand',
      component: () => import('@/views/warehouse'),
      redirect: 'warehouse/brand/list',
      name: 'Brand',
      meta: {
        title: 'Brand',
        roles: ['admin', 'manager', 'accountant']
      },
      children: [
        {
          path: 'list',
          component: () => import('@/views/warehouse/brand/list-brand'),
          name: 'List Brand',
          meta: {
            title: 'List Brand'
          }
        },
        {
          path: 'add',
          component: () => import('@/views/warehouse/brand/add-brand'),
          name: 'Add Brand',
          meta: {
            title: 'Add Brand'
          }
        }
      ]
    },
    {
      path: 'product-type',
      component: () => import('@/views/warehouse'),
      redirect: 'warehouse/product-type/list',
      name: 'Product Type',
      meta: {
        title: 'Product Type',
        roles: ['admin', 'manager', 'accountant']
      },
      children: [
        {
          path: 'list',
          component: () => import('@/views/warehouse/product-type/list-product-type'),
          name: 'List Product Type',
          meta: {
            title: 'List Product Type'
          }
        },
        {
          path: 'add',
          component: () => import('@/views/warehouse/product-type/add-product-type'),
          name: 'Add Product Type',
          meta: {
            title: 'Add Product Type'
          }
        }
      ]
    },
  ]
}

export default warehouseRouter
