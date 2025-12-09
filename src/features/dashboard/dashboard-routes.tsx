import { PageLayout } from '@/components/layout';
import DashboardPage from './pages/dashboard-page';

export const dashboardRoutes = [
  {
    path: '/dashboard',
    element: (
      <PageLayout>
        <DashboardPage />
      </PageLayout>
    ),
  },
];
