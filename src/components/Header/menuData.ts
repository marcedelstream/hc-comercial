import type { MenuItem } from "./types";

export const menuData: MenuItem[] = [
  {
    title: "Destacados",
    path: "/shop?sort=popular",
  },
  {
    title: "Tienda",
    path: "/shop",
  },
  {
    title: "Páginas",
    submenu: [
      {
        title: "Tienda completa",
        path: "/shop",
      },
      {
        title: "Checkout",
        path: "/checkout",
      },
      {
        title: "Carrito",
        path: "/cart",
      },
      {
        title: "Lista de deseos",
        path: "/wishlist",
      },
    ],
  },
  {
    title: "Contacto",
    path: "/contact",
  },
];
