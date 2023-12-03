
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Login.vue') }
    ]
  },
  {
    path: '/panel',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Panel-Card.vue') }
    ]
  },
  {
    path: '/catalogo',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Catalogo-Cuentas.vue') }
    ]
  },
  {
    path: '/compras',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Compras-pagina.vue') }
    ]
  },
  {
    path: '/ventas',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Ventas-pagina.vue') }
    ]
  },
  {
    path: '/inventario',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Inventario-pagina.vue') }
    ]
  },
  {
    path: '/reportes',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Reportes-pdf.vue') }
    ]
  },
  //reportes.
  {
    path: '/EstadoR',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Estado-R-repo.vue') }
    ]
  },
  {
    path: '/EstadoC',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Estado-C-repo.vue') }
    ]
  },
  {
    path: '/Balance',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Balance-repo.vue') }
    ]
  },
  {
    path: '/EstadoFE',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Estado-F-E-repo.vue') }
    ]
  },
  {
    path: '/Cliente',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Cliente-repo.vue') }
    ]
  },
  {
    path: '/Provee',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Proveedor-repo.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
