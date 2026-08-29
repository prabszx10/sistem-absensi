import React, { useState, useEffect } from 'react';
import { Typography, Card, Button, message } from 'antd';
import { ClockCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import axios from 'axios';

interface HandleSetClock {
  timeIn: string;
  timeOut: string;
}

export const DashboardHome: React.FC = () => {
  const { Text } = Typography;
  const today: Date = new Date();

  const [userName, setUserName] = useState<string>('');
  const [timeIn, setTimeIn] = useState('--:--');
  const [timeOut, setTimeOut] = useState('--:--');
  const [loadingIn, setLoadingIn] = useState<boolean>(false);
  const [loadingOut, setLoadingOut] = useState<boolean>(false);
  const [timeChange, setTimeChange] = useState(0)

  const formattedDate: string = today.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  useEffect(() => {
    const savedName = localStorage.getItem('user_name');
    if (savedName) {
      setUserName(savedName);
    }
  }, []);

  useEffect(() => {
    handleSetClock()
  }, [timeChange]);

  const handleClock = async (status: any) => {
    try {
      if (status) {
        setLoadingOut(true);
      } else {
        setLoadingIn(true);
      }

      await axios.post('/attendance', {
        status: status ? "PULANG" : "MASUK",
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      });

      const successMsg = status ? 'Berhasil Clock Out!' : 'Berhasil Clock In!';
      message.success(successMsg);
      setTimeChange((prev) => prev + 1);
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        const apiMessage = error.response.data?.message;
        let errorMessage = (Array.isArray(apiMessage)) ? apiMessage.join(', ') : apiMessage;
        console.log("Error handleClock : ", errorMessage)
      }

      const errMsg = status ? 'Gagal melakukan Clock Out!' : 'Gagal melakukan Clock In!';
      message.error(errMsg);
    } finally {
      if (status) {
        setLoadingOut(false);
      } else {
        setLoadingIn(false);
      }
    }
  };

  const handleSetClock = async () => {
    try {
      const response = await axios.get<HandleSetClock>('/attendance', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      });

      setTimeIn(formatToHHMM(response.data.timeIn))
      setTimeOut(formatToHHMM(response.data.timeOut))
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        const apiMessage = error.response.data?.message;
        let errorMessage = (Array.isArray(apiMessage)) ? apiMessage.join(', ') : apiMessage;
        console.log("Error handleSetClock : ", errorMessage)
      }
    }
  }

  const formatToHHMM = (timeString?: string) => {
    if (!timeString) return "--:--";
    const [hh, mm] = timeString.split(':');
    return `${hh}:${mm}`;
  };

  return (
    <div>
      <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#111827', marginBottom: '12px' }}>
        Selamat Datang, <span style={{ color: '#2563eb' }}>{userName}</span>
      </h2>

      <Card
        size="medium"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '12px',
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '10px 16px',
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        }}
      >
        <div style={{ fontSize: '14px', color: '#4b5563' }}>
          Hari Ini, <Text style={{ fontWeight: '600', color: '#111827' }}>{formattedDate}</Text>
        </div>
        <div style={{ margin: "20px 0" }}>
          <span
            style={{
              fontFamily: 'monospace',
              fontSize: '13px',
              fontWeight: '600',
              color: '#2563eb',
              backgroundColor: '#eff6ff',
              padding: '2px 8px',
              borderRadius: '4px',
            }}
          >
            <ClockCircleOutlined /> {timeIn || '--:--'}
          </span>

          <span
            style={{
              fontFamily: 'monospace',
              fontSize: '13px',
              fontWeight: '600',
              color: 'red',
              backgroundColor: '#eff6ff',
              padding: '2px 8px',
              borderRadius: '4px',
              marginLeft: '10px'
            }}
          >
            <ClockCircleOutlined /> {timeOut || '--:--'}
          </span>
        </div>

        <Button
          type="primary"
          icon={loadingIn ? <LoadingOutlined /> : <ClockCircleOutlined />}
          size={'large'}
          style={{ width: '100%' }}
          onClick={() => handleClock(0)}
        >
          Clock In
        </Button>

        <Button
          type="primary"
          icon={loadingOut ? <LoadingOutlined /> : <ClockCircleOutlined />}
          size={'large'}
          style={{ width: '100%', marginTop: "10px" }}
          danger
          onClick={() => handleClock(1)}
        >
          Clock Out
        </Button>

      </Card>
    </div>
  );
};