/**
 * ⚠ These are used just to render the Sidebar!
 * You can include any link here, local or external.
 *
 */

interface IRoute {
  path?: string;
  icon?: string;
  name: string;
  routes?: IRoute[];
  checkActive?(pathname: String, route: IRoute): boolean;
  exact?: boolean;
}

export function routeIsActive(pathname: String, route: IRoute): boolean {
  if (route.checkActive) {
    return route.checkActive(pathname, route);
  }

  return route?.exact
    ? pathname == route?.path
    : route?.path
    ? pathname.indexOf(route.path) === 0
    : false;
}

const routes: IRoute[] = [
  {
    path: "/dashboard", // the url
    icon: "HomeIcon", // the component being exported from icons/index.js
    name: "Dashboard", // name that appear in Sidebar
    exact: true,
  },
  // {
  //   icon: "PagesIcon",
  //   name: "Campaign",
  //   routes: [
  //     // submenu
  //     {
  //       path: "/example/login",
  //       name: "Quests",
  //     },
  //     {
  //       path: "/example/create-account",
  //       name: "On-Boarding",
  //     },
  //     {
  //       path: "/example/forgot-password",
  //       name: "Twitter Space",
  //     },
  //     // {
  //     //   path: '/example/404',
  //     //   name: '404',
  //     // },
  //     // {
  //     //   path: '/example/blank',
  //     //   name: 'Blank',
  //     // },
  //   ],
  // },
  // {
  //   icon: "PagesIcon",
  //   name: "Reward",
  //   routes: [
  //     // submenu
  //     {
  //       path: "/example/login",
  //       name: "Quests",
  //     },
  //     {
  //       path: "/example/create-account",
  //       name: "On-Boarding",
  //     },
  //     {
  //       path: "/example/forgot-password",
  //       name: "Twitter Space",
  //     },
  //     // {
  //     //   path: '/example/404',
  //     //   name: '404',
  //     // },
  //     // {
  //     //   path: '/example/blank',
  //     //   name: 'Blank',
  //     // },
  //   ],
  // },
  // {
  //   path: "/example/forms",
  //   icon: "FormsIcon",
  //   name: "Widget",
  // },
  // {
  //   icon: "PagesIcon",
  //   name: "Analytics",
  //   routes: [
  //     // submenu
  //     {
  //       path: "/example/login",
  //       name: "Quests",
  //     },
  //     {
  //       path: "/example/create-account",
  //       name: "On-Boarding",
  //     },
  //     {
  //       path: "/example/forgot-password",
  //       name: "Twitter Space",
  //     },
  //     // {
  //     //   path: '/example/404',
  //     //   name: '404',
  //     // },
  //     // {
  //     //   path: '/example/blank',
  //     //   name: 'Blank',
  //     // },
  //   ],
  // },
  // {
  //   path: "/example/cards",
  //   icon: "CardsIcon",
  //   name: "Token Mining",
  // },
  // {
  //   path: "/example/charts",
  //   icon: "ChartsIcon",
  //   name: "Settings",
  // },
  // {
  //   path: "/example/buttons",
  //   icon: "ButtonsIcon",
  //   name: "Buttons",
  // },
  // {
  //   path: "/example/modals",
  //   icon: "ModalsIcon",
  //   name: "Modals",
  // },
  // {
  //   path: "/example/tables",
  //   icon: "TablesIcon",
  //   name: "Tables",
  // },
];

export type { IRoute };
export default routes;
