const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/Login.vue") }],
  },
  {
    path: "/panel",
    component: () => import("layouts/MainLayout.vue"),
    meta: { requireAuth: true },
    children: [{ path: "", component: () => import("pages/Panel-Card.vue") }],
  },
  {
    path: "/catalogo",
    component: () => import("layouts/MainLayout.vue"),
    meta: { requireAuth: true },
    children: [
      { path: "", component: () => import("pages/Catalogo-Cuentas.vue") },
    ],
  },
  {
    path: "/compras",
    component: () => import("layouts/MainLayout.vue"),
    meta: { requireAuth: true },
    children: [
      { path: "", component: () => import("pages/Compras-pagina.vue") },
    ],
  },
  {
    path: "/ventas",
    component: () => import("layouts/MainLayout.vue"),
    meta: { requireAuth: true },
    children: [
      { path: "", component: () => import("pages/Ventas-pagina.vue") },
    ],
  },
  {
    path: "/inventario",
    component: () => import("layouts/MainLayout.vue"),
    meta: { requireAuth: true },
    children: [
      { path: "", component: () => import("pages/Inventario-pagina.vue") },
    ],
  },
  {
    path: "/reportes",
    component: () => import("layouts/MainLayout.vue"),
    meta: { requireAuth: true },
    children: [{ path: "", component: () => import("pages/Reportes-pdf.vue") }],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
