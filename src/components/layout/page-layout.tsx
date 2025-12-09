import React, { useState } from 'react';
import { Layout, theme } from 'antd';
import Navbar from './page-header';
import Sidebar from './sidebar';

const { Content } = Layout;

export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState('dashboard');

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sidebar
        collapsed={collapsed}
        onCollapse={setCollapsed}
        selectedKey={selectedKey}
        onMenuClick={setSelectedKey}
      />

      <Layout>
        <Navbar collapsed={collapsed} onCollapse={setCollapsed} />

        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {/* Main content goes here */}
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
