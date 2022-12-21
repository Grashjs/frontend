import { RouteObject } from 'react-router';

import Authenticated from 'src/components/Authenticated';
import { Navigate } from 'react-router-dom';

import BoxedSidebarLayout from 'src/layouts/BoxedSidebarLayout';
import DocsLayout from 'src/layouts/DocsLayout';
import BaseLayout from 'src/layouts/BaseLayout';
import AccentHeaderLayout from 'src/layouts/AccentHeaderLayout';
import AccentSidebarLayout from 'src/layouts/AccentSidebarLayout';
import ExtendedSidebarLayout from 'src/layouts/ExtendedSidebarLayout';
import CollapsedSidebarLayout from 'src/layouts/CollapsedSidebarLayout';
import BottomNavigationLayout from 'src/layouts/BottomNavigationLayout';
import TopNavigationLayout from 'src/layouts/TopNavigationLayout';

import appRoutes from './app';
import dashboardsRoutes from './dashboards';
import blocksRoutes from './blocks';
import applicationsRoutes from './applications';
import managementRoutes from './management';
import documentationRoutes from './documentation';
import accountRoutes from './account';
import baseRoutes from './base';
import Oauth2RedirectHandler from '../content/own/Oauth2/Oauth2RedirectHandler';
import Guest from 'src/components/Guest';

const router: RouteObject[] = [
  {
    path: 'account',
    children: accountRoutes
  },
  {
    path: '',
    element: <BaseLayout />,
    children: baseRoutes
  },
  {
    path: 'app',
    element: (
      <Authenticated>
        <ExtendedSidebarLayout />
      </Authenticated>
    ),
    children: appRoutes
  },
  // Documentation

  {
    path: 'docs',
    element: <DocsLayout />,
    children: documentationRoutes
  },
  {
    path: 'oauth2/redirect',
    element: (
      <Guest>
        <Oauth2RedirectHandler />
      </Guest>
    )
  },

  // Boxed Sidebar Layout

  {
    path: 'boxed-sidebar',
    element: (
      <Authenticated>
        <BoxedSidebarLayout />
      </Authenticated>
    ),
    children: [
      {
        path: '',
        element: <Navigate to="dashboards" replace />
      },
      {
        path: 'dashboards',
        children: dashboardsRoutes
      },
      {
        path: 'blocks',
        children: blocksRoutes
      },
      {
        path: 'applications',
        children: applicationsRoutes
      },
      {
        path: 'management',
        children: managementRoutes
      }
    ]
  },

  // Accent Sidebar Layout

  {
    path: 'accent-sidebar',
    element: (
      <Authenticated>
        <AccentSidebarLayout />
      </Authenticated>
    ),
    children: [
      {
        path: '',
        element: <Navigate to="dashboards" replace />
      },
      {
        path: 'dashboards',
        children: dashboardsRoutes
      },
      {
        path: 'blocks',
        children: blocksRoutes
      },
      {
        path: 'applications',
        children: applicationsRoutes
      },
      {
        path: 'management',
        children: managementRoutes
      }
    ]
  },

  // Collapsed Sidebar Layout

  {
    path: 'collapsed-sidebar',
    element: (
      <Authenticated>
        <CollapsedSidebarLayout />
      </Authenticated>
    ),
    children: [
      {
        path: '',
        element: <Navigate to="dashboards" replace />
      },
      {
        path: 'dashboards',
        children: dashboardsRoutes
      },
      {
        path: 'blocks',
        children: blocksRoutes
      },
      {
        path: 'applications',
        children: applicationsRoutes
      },
      {
        path: 'management',
        children: managementRoutes
      }
    ]
  },

  // Bottom Navigation Layout

  {
    path: 'bottom-navigation',
    element: (
      <Authenticated>
        <BottomNavigationLayout />
      </Authenticated>
    ),
    children: [
      {
        path: '',
        element: <Navigate to="dashboards" replace />
      },
      {
        path: 'dashboards',
        children: dashboardsRoutes
      },
      {
        path: 'blocks',
        children: blocksRoutes
      },
      {
        path: 'applications',
        children: applicationsRoutes
      },
      {
        path: 'management',
        children: managementRoutes
      }
    ]
  },

  // Top Navigation Layout

  {
    path: 'top-navigation',
    element: (
      <Authenticated>
        <TopNavigationLayout />
      </Authenticated>
    ),
    children: [
      {
        path: '',
        element: <Navigate to="dashboards" replace />
      },
      {
        path: 'dashboards',
        children: dashboardsRoutes
      },
      {
        path: 'blocks',
        children: blocksRoutes
      },
      {
        path: 'applications',
        children: applicationsRoutes
      },
      {
        path: 'management',
        children: managementRoutes
      }
    ]
  },

  // Accent Header Layout

  {
    path: 'accent-header',
    element: (
      <Authenticated>
        <AccentHeaderLayout />
      </Authenticated>
    ),
    children: [
      {
        path: '',
        element: <Navigate to="dashboards" replace />
      },
      {
        path: 'dashboards',
        children: dashboardsRoutes
      },
      {
        path: 'blocks',
        children: blocksRoutes
      },
      {
        path: 'applications',
        children: applicationsRoutes
      },
      {
        path: 'management',
        children: managementRoutes
      }
    ]
  },

  // Extended Sidebar Layout

  {
    path: 'extended-sidebar',
    element: (
      <Authenticated>
        <ExtendedSidebarLayout />
      </Authenticated>
    ),
    children: [
      {
        path: 'dashboards',
        children: dashboardsRoutes
      },
      {
        path: 'blocks',
        children: blocksRoutes
      },
      {
        path: 'applications',
        children: applicationsRoutes
      },
      {
        path: 'management',
        children: managementRoutes
      }
    ]
  }
];

export default router;
