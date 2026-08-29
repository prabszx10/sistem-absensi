import React, { useEffect, useState } from 'react';
import { Card, Button, Spin, message, DatePicker, Table } from 'antd';
import axios from 'axios';
import dayjs, { Dayjs } from 'dayjs';
import type { ColumnsType } from 'antd/es/table';

interface AttendanceType {
    email: string;
    nama: string;
    date: Date;
    timeIn?: string;
    timeOut?: string;
}

const getFormattedDate = (date: Dayjs) => date.format('YYYY-MM-DD');

export const AttendancePage: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [startDate, setStartDate] = useState<string>(getFormattedDate(dayjs().startOf('month')));
    const [endDate, setEndDate] = useState<string>(getFormattedDate(dayjs()));
    const [attendanceList, setAttendanceList] = useState<AttendanceType[]>([]);
    const { RangePicker } = DatePicker;

    const handleRangeChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
        if (dates && dates[0] && dates[1]) {
            setStartDate(dates[0].format('YYYY-MM-DD'));
            setEndDate(dates[1].format('YYYY-MM-DD'));
        } else {
            setStartDate('');
            setEndDate('');
        }
    };

    const handleSearch = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/attendance/filter', {
                params: {
                    startDate: startDate,
                    endDate: endDate,
                },
            });
            const dataWithKeys = res.data.map((item: any, index: number) => ({
                ...item,
                key: item.id || `attendance-${index}`,
                date: item.date ? dayjs(item.date).format('DD MMM YYYY') : '-',
                timeIn: item.timeIn ? dayjs(item.timeIn).format('DD MMM YYYY HH:mm') : '-',
                timeOut: item.timeOut ? dayjs(item.timeOut).format('DD MMM YYYY HH:mm') : '-',
            })); setAttendanceList(dataWithKeys);
        } catch (err: any) {
            const backendMessage = err.response?.data?.message;

            if (Array.isArray(backendMessage)) {
                message.error(backendMessage.join(', '));
            } else if (typeof backendMessage === 'string') {
                message.error(backendMessage);
            } else {
                message.error('Terjadi kesalahan pada sistem');
            }
            setAttendanceList([])
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        handleSearch()
    }, [])

    const columns: ColumnsType<AttendanceType> = [
        { title: 'Email', dataIndex: 'email', key: 'email' },
        { title: 'Nama', dataIndex: 'nama', key: 'nama' },
        { title: 'Tanggal', dataIndex: 'date', key: 'date' },
        { title: 'Jam Masuk', dataIndex: 'timeIn', key: 'timeIn' },
        { title: 'Jam Pulang', dataIndex: 'timeOut', key: 'timeOut' },
    ];

    return (
        <>
            <Spin spinning={loading} fullscreen />
            <Card title="Daftar Kehadiran">
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: '8px',
                        width: '100%',
                    }}
                >
                    <RangePicker
                        value={[
                            startDate ? dayjs(startDate, 'YYYY-MM-DD') : null,
                            endDate ? dayjs(endDate, 'YYYY-MM-DD') : null,
                        ]}
                        onChange={handleRangeChange}
                        format="YYYY-MM-DD"
                    />

                    <Button type="primary" onClick={() => { handleSearch() }}>Search</Button>
                </div>
                <Table
                    columns={columns}
                    dataSource={attendanceList}
                    loading={loading}
                    pagination={{ pageSize: 10 }}
                    style={{marginTop:"20px"}}
                    scroll={{ x: 'max-content' }}
                />
            </Card>
        </>
    );
}