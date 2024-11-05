const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/Login-page.vue") }],
  },
  {
    path: "/panel",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/Panel-Card.vue") }],
  },
  {
    path: "/catalogo",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/Catalogo-Cuentas.vue") },
    ],
  },
  {
    path: "/reportes",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/Reportes-pdf.vue") }],
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
    path: '/Balance',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Balance-repo.vue') }
    ]
  },
  {
    path: '/transaccion',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Transacciones-p.vue') }
    ]
  },
  {
    path: '/editar',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Editar-data.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
