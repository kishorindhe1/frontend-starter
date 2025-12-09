// components/Sidebar.tsx
import {
  AppWindow,
  BarChart3,
  Bot,
  Calendar,
  FileText,
  Globe,
  LayoutDashboard,
  LineChart,
  ListChecks,
  Mail,
  ShoppingCart,
  Table,
  UserCircle,
  Users,
} from 'lucide-react';
import React from 'react';
import { Badge, Layout, Menu } from 'antd';
import { useLayoutStore } from '@/store';

const { Sider } = Layout;

const Sidebar: React.FC = () => {
  const { sidebarCollapsed, selectedMenuKey, setSelectedMenuKey } =
    useLayoutStore();

  const items = [
    {
      key: 'dashboard',
      icon: <LayoutDashboard size={18} />,
      label: 'Dashboard',
    },
    { key: 'ecommerce', icon: <ShoppingCart size={18} />, label: 'eCommerce' },
    { key: 'analytics', icon: <BarChart3 size={18} />, label: 'Analytics' },
    { key: 'marketing', icon: <Mail size={18} />, label: 'Marketing' },
    { key: 'crm', icon: <Users size={18} />, label: 'CRM' },
    { key: 'stocks', icon: <LineChart size={18} />, label: 'Stocks' },
    {
      key: 'saas',
      icon: <AppWindow size={18} />,
      label: (
        <span>
          SaaS{' '}
          <Badge
            count="NEW"
            style={{ backgroundColor: '#52c41a', marginLeft: 8 }}
          />
        </span>
      ),
    },
    {
      key: 'logistics',
      icon: <Globe size={18} />,
      label: (
        <span>
          Logistics{' '}
          <Badge
            count="NEW"
            style={{ backgroundColor: '#52c41a', marginLeft: 8 }}
          />
        </span>
      ),
    },
    { type: 'divider' as const },
    {
      key: 'ai',
      icon: <Bot size={18} />,
      label: (
        <span>
          AI Assistant{' '}
          <Badge
            count="NEW"
            style={{ backgroundColor: '#1890ff', marginLeft: 8 }}
          />
        </span>
      ),
      children: [
        { key: 'ai-chat', label: 'Chat Assistant' },
        { key: 'ai-analytics', label: 'AI Analytics' },
      ],
    },
    {
      key: 'ecommerce-sub',
      icon: <ShoppingCart size={18} />,
      label: (
        <span>
          E-commerce{' '}
          <Badge
            count="NEW"
            style={{ backgroundColor: '#1890ff', marginLeft: 8 }}
          />
        </span>
      ),
      children: [
        { key: 'products', label: 'Products' },
        { key: 'orders', label: 'Orders' },
        { key: 'customers', label: 'Customers' },
      ],
    },
    { key: 'calendar', icon: <Calendar size={18} />, label: 'Calendar' },
    { key: 'profile', icon: <UserCircle size={18} />, label: 'User Profile' },
    { key: 'tasks', icon: <ListChecks size={18} />, label: 'Tasks' },
    { key: 'forms', icon: <FileText size={18} />, label: 'Forms' },
    { key: 'tables', icon: <Table size={18} />, label: 'Tables' },
  ];

  return (
    <Sider trigger={null} collapsible collapsed={sidebarCollapsed} width={260}>
      <div
        style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 16px',
        }}
      >
        <h2
          style={{
            margin: 0,
            fontWeight: 700,
            fontSize: sidebarCollapsed ? 18 : 22,
          }}
        >
          {sidebarCollapsed ? 'RE' : 'Refurbedge'}
        </h2>
      </div>

      <Menu
        mode="inline"
        selectedKeys={[selectedMenuKey]}
        defaultOpenKeys={['ai', 'ecommerce-sub']}
        items={items}
        onClick={({ key }) => setSelectedMenuKey(key)}
        style={{ borderRight: 0, background: 'transparent' }}
      />
    </Sider>
  );
};

export default Sidebar;
