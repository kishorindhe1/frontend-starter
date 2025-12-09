import { useRoutes } from 'react-router-dom';
import { type FC } from 'react';

import { authRoutes } from '@/features/auth/auth-routes';

const PublicRoutes: FC = () => {
  const routes = [...authRoutes];

  return useRoutes(routes);
};

export { PublicRoutes };
