import React, { useState, useEffect } from 'react';
import { Typography, Card } from 'antd';

export const DashboardHome: React.FC = () => {
  const [time, setTime] = useState<string>('');
  const { Text } = Typography;
  const [userName, setUserName] = useState<string>('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      });
      setTime(timeString);
    };

    updateClock();

    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const savedName = localStorage.getItem('user_name');
    if (savedName) {
      setUserName(savedName);
    }
  }, []);

  return (
    <div>
      <h2>Selamat Datang {userName}</h2>
      <Card size="small" style={{ display: 'inline-block', backgroundColor: '#f5f5f5' }}>
        <Text code style={{ fontSize: '18px', fontWeight: 'bold' }}>
          {time || '00:00:00'}
        </Text>
      </Card>
    </div>
  );
};