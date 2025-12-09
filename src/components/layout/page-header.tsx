// components/Navbar.tsx
import {
  Avatar,
  Badge,
  Button,
  Dropdown,
  Input,
  Layout,
  Space,
  Typography,
  type MenuProps,
} from 'antd';
import { Bell, Menu as MenuIcon, PanelLeftClose, Search } from 'lucide-react';
import React from 'react';
import ThemeToggle from '../common/theme-toggle';

const { Header } = Layout;
const { Text } = Typography;

interface INavbarProps {
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
}

const Navbar: React.FC<INavbarProps> = ({ collapsed, onCollapse }) => {
  // Ant Design v5+ uses `items` directly in Dropdown via `menu` prop
  const menuItems: MenuProps['items'] = [
    { key: 'profile', label: 'Your Profile' },
    { key: 'settings', label: 'Settings' },
    { type: 'divider' },
    { key: 'logout', label: 'Logout', danger: true },
  ];

  return (
    <Header className="sticky top-0 z-10 flex items-center justify-between px-6 h-16   shadow-sm">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <Button
          type="text"
          icon={
            collapsed ? <MenuIcon size={22} /> : <PanelLeftClose size={22} />
          }
          onClick={() => onCollapse(!collapsed)}
          className="w-16 h-16 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
        />

        <div className="relative max-w-sm">
          <Input
            placeholder="Search or type command..."
            prefix={<Search size={16} className="text-gray-500" />}
            allowClear
            size="large"
            className="w-80 pl-10 pr-4 py-2.5 rounded-xl border-gray-300 dark:border-gray-700 focus:border-primary-500 dark:bg-gray-800 dark:text-white placeholder-gray-500 hover:border-gray-400"
          />
        </div>
      </div>

      {/* Right Section */}
      <Space size={16} className="flex items-center">
        {/* Notifications */}
        <Badge count={8} size="small">
          <Button
            type="text"
            shape="circle"
            icon={<Bell size={20} />}
            className="w-11 h-11 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full transition-colors"
          />
        </Badge>

        {/* Theme Toggle */}
        <ThemeToggle />
        {/* User Dropdown - AntD v5+ Syntax */}
        <Dropdown
          menu={{ items: menuItems }}
          trigger={['click']}
          placement="bottomRight"
        >
          <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 px-3 py-2 rounded-xl transition-colors">
            <Avatar
              size={36}
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Musharof"
              className="ring-2 ring-offset-2 ring-transparent hover:ring-primary-500 transition-all"
            />
            <Text strong className="text-base text-gray-900 dark:text-white">
              Musharof
            </Text>
          </div>
        </Dropdown>
      </Space>
    </Header>
  );
};

export default Navbar;
