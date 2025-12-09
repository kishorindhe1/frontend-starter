import { useRoutes } from 'react-router-dom';
import { type FC } from 'react';

import { authRoutes } from '@/features/auth/auth-routes';
import { dashboardRoutes } from '@/features/dashboard/dashboard-routes';

const PublicRoutes: FC = () => {
  const routes = [...authRoutes, ...dashboardRoutes];

  return useRoutes(routes);
};

export default PublicRoutes;
