import React, { useState } from 'react';
import { Layout, Menu, Button, theme } from 'antd';
import { UserOutlined, DashboardOutlined, LogoutOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';

const { Header, Sider, Content } = Layout;

export const DashboardLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { token: { colorBgContainer, borderRadiusLG } } = theme.useToken();
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <Layout style={{ minHeight: '100vh', width: '100vw' }}>
      <Sider 
        collapsible 
        collapsed={collapsed} 
        onCollapse={(value) => setCollapsed(value)}
        breakpoint="lg" // Mengatur batas layar (lg = 992px)
        collapsedWidth="80" // Lebar sider saat mengecil (bisa set ke "0" jika ingin benar-benar tersembunyi di HP)
        onBreakpoint={(broken) => {
          // Otomatis collapse jika ukuran layar lebih kecil dari breakpoint 'lg'
          setCollapsed(broken);
        }}
      >
        <div style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)', borderRadius: 6, color: '#fff', textAlign: 'center', lineHeight: '32px', fontWeight: 'bold', overflow: 'hidden' }}>
          {collapsed ? 'SA' : 'Sistem Absensi'}
        </div>
        <Menu
          theme="dark"
          selectedKeys={[location.pathname]}
          onClick={(e) => navigate(e.key)}
          mode="inline"
          items={[
            { key: '/dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
            { key: '/employeeProfile', icon: <UserOutlined />, label: 'Employee Profile' },
            { key: '/attendance', icon: <ClockCircleOutlined />, label: 'Attendance' },
          ]}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: '0 16px', background: colorBgContainer, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          <Button type="text" icon={<LogoutOutlined />} onClick={handleLogout}>
            Logout
          </Button>
        </Header>
        <Content style={{ margin: '16px' }}>
          <div style={{ padding: 24, minHeight: 360, background: colorBgContainer, borderRadius: borderRadiusLG }}>
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};