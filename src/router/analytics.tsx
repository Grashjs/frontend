import { lazy, Suspense } from 'react';

import SuspenseLoader from 'src/components/SuspenseLoader';

const Loader = (Component) => (props) =>
  (
    <Suspense fallback={<SuspenseLoader />}>
      <Component {...props} />
    </Suspense>
  );

const WOAnalytics = Loader(
  lazy(() => import('../content/own/Analytics/WorkOrder'))
);
const AssetAnalytics = Loader(
  lazy(() => import('../content/own/Analytics/Asset'))
);
const analyticsRoutes = [
  {
    path: 'work-orders',
    children: [
      { path: 'status', element: <WOAnalytics /> },
      { path: 'analysis', element: <WOAnalytics /> },
      { path: 'aging', element: <WOAnalytics /> },
      { path: 'time-cost', element: <WOAnalytics /> }
    ]
  },
  {
    path: 'assets',
    children: [
      { path: 'reliability', element: <AssetAnalytics /> },
      { path: 'cost', element: <AssetAnalytics /> },
      { path: 'useful-life', element: <AssetAnalytics /> }
    ]
  }
];

export default analyticsRoutes;
