import React, { useEffect, useState } from 'react';
import { Card, Form, Image, Upload, Input, Button, message, Flex } from 'antd';
import type { UploadFile } from 'antd/es/upload/interface';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';

export const EmployeeProfilePage: React.FC = () => {
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const currentEmployeeId = localStorage.getItem('randomize');
    const [currentPhoto, setCurrentPhoto] = useState<string | null>(null);

    const handleSubmit = async (values: any) => {
        try {
            const formData = new FormData();
            formData.append('email', values.email);
            formData.append('nama', values.nama);
            formData.append('posisi', values.posisi);
            formData.append('phoneNo', values.phoneNo);

            if (values.password) {
                formData.append('password', values.password);
            }

            if (fileList.length > 0 && fileList[0].originFileObj) {
                formData.append('photo', fileList[0].originFileObj);
            }

            const config = {
                headers: { 'Content-Type': 'multipart/form-data' },
            };

            await axios.patch(`/employee/${currentEmployeeId}`, formData, config);
            message.success('Data berhasil diperbarui');

            setFileList([]);
            handleGetData()
        } catch (err: any) {
            const backendMessage = err.response?.data?.message;

            if (Array.isArray(backendMessage)) {
                message.error(backendMessage.join(', '));
            } else if (typeof backendMessage === 'string') {
                message.error(backendMessage);
            } else {
                message.error('Terjadi kesalahan pada sistem');
            }
        }
    };

    const handleGetData = async () => {
        try {
            const res = await axios.get(`/employee/${currentEmployeeId}`);
            form.setFieldsValue(res.data);
            setCurrentPhoto(res.data.photo);
        } catch (err: any) {
            const backendMessage = err.response?.data?.message;

            if (Array.isArray(backendMessage)) {
                message.error(backendMessage.join(', '));
            } else if (typeof backendMessage === 'string') {
                message.error(backendMessage);
            } else {
                message.error('Terjadi kesalahan pada sistem');
            }
        }
    }


    useEffect(() => {
        handleGetData();
    }, []);

    return (
        <>
            <Card title="Profil Karyawan">
                <Form form={form} layout="vertical" onFinish={handleSubmit}>
                    <Flex justify="space-between">
                        <div style={{ flex: '1 1 15%', minWidth: '280px' }}>
                            {fileList.length === 0 && (
                                <Form.Item label="Foto Saat Ini">
                                    <Image
                                        width={80}
                                        height={80}
                                        style={{ objectFit: 'cover', borderRadius: 8 }}
                                        src={`http://localhost:3000/uploads/employees/${currentPhoto}`}
                                        fallback="https://via.placeholder.com/80?text=No+Image"
                                    />
                                </Form.Item>
                            )}

                            <Form.Item label="Foto Profil">
                                <Upload
                                    beforeUpload={() => false}
                                    fileList={fileList}
                                    onChange={({ fileList }) => setFileList(fileList.slice(-1))}
                                    maxCount={1}
                                    accept="image/*"
                                >
                                    <Button icon={<UploadOutlined />}>Pilih Foto</Button>
                                </Upload>
                            </Form.Item>
                        </div>
                        <div style={{ flex: '1 1 80%', minWidth: '280px' }}>
                            <Form.Item
                                name="email"
                                label="Email"
                                rules={[
                                    { required: true, message: 'Email wajib diisi' },
                                    { type: 'email', message: 'Format email tidak valid' },
                                ]}
                            >
                                <Input placeholder="Masukkan email" />
                            </Form.Item>

                            <Form.Item
                                name="nama"
                                label="Nama"
                                rules={[{ required: true, message: 'Nama wajib diisi' }]}
                            >
                                <Input placeholder="Masukkan nama" />
                            </Form.Item>

                            <Form.Item
                                name="posisi"
                                label="Posisi"
                                rules={[{ required: true, message: 'Posisi wajib diisi' }]}
                            >
                                <Input placeholder="Masukkan posisi" />
                            </Form.Item>

                            <Form.Item
                                name="phoneNo"
                                label="Nomer Hp"
                                rules={[{ required: true, message: 'Nomer Hp wajib diisi' }]}
                            >
                                <Input placeholder="Masukkan nomer hp" />
                            </Form.Item>

                            <Form.Item
                                name="password"
                                label="Password"
                            >
                                <Input.Password
                                    placeholder={'Kosongkan jika tidak ingin mengubah password'}
                                />
                            </Form.Item>
                        </div>
                    </Flex>
                    <Flex justify="end">
                        <Button type="primary" htmlType="submit">
                            Perbarui Data
                        </Button>
                    </Flex>
                </Form>
            </Card>
        </>
    );
}