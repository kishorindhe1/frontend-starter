import { Layout } from 'antd';
import Navbar from './page-header';
import Sidebar from './page-sidebar';

const { Content } = Layout;

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <Layout hasSider className="min-h-screen">
      <Sidebar />
      <Layout>
        <Navbar />
        <Content className="p-3">{children}</Content>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;
