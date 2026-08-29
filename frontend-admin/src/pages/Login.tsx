import React, { useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

const onFinish = async (values: any) => {
  setLoading(true);
  try {
    const res = await axios.post('/auth/login', values, {
      withCredentials: true,
    });

    if (res.data?.access_token) {
      localStorage.setItem('token', res.data.access_token);
      localStorage.setItem('user_name', res.data.user.name);
      localStorage.setItem('randomize', res.data.user.employeeId);
    }

    message.success('Login berhasil!');
    navigate('/dashboard');
  } catch (err: any) {
    message.error(err.response?.data?.message || 'Email atau password salah');
  } finally {
    setLoading(false);
  }
};

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f0f2f5' }}>
      <Card title="Portal Admin Absensi" style={{ width: 360, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <Form name="login" onFinish={onFinish} layout="vertical">
          <Form.Item name="email" rules={[{ required: true, message: 'Masukkan Email!' }, { type: 'email', message: 'Email tidak valid!' }]}>
            <Input prefix={<UserOutlined />} placeholder="Email" size="large" />
          </Form.Item>

          <Form.Item name="password" rules={[{ required: true, message: 'Masukkan Password!' }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="Password" size="large" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large" loading={loading}>
              Log in
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};