import React, { useEffect, useState } from 'react';
import { Table, Space, Button, Card, Modal, Form, Input, Popconfirm, message, Upload, Avatar, Image, Flex, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { UploadFile } from 'antd/es/upload/interface';
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined, UserOutlined } from '@ant-design/icons';
import axios from 'axios';

interface EmployeeType {
  key?: string;
  id?: string;
  email: string;
  nama: string;
  posisi: string;
  phoneNo: string;
  photo?: string;
}
const { Title } = Typography;
export const EmployeePage: React.FC = () => {
  const [employees, setEmployees] = useState<EmployeeType[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<EmployeeType | null>(null);

  // State khusus untuk upload file
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const [form] = Form.useForm();

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/employee');
      const dataWithKeys = res.data.map((item: any) => ({ ...item, key: item.id }));
      setEmployees(dataWithKeys);
    } catch (err: any) {
      const backendMessage = err.response?.data?.message;

      if (Array.isArray(backendMessage)) {
        message.error(backendMessage.join(', '));
      } else if (typeof backendMessage === 'string') {
        message.error(backendMessage);
      } else {
        message.error('Terjadi kesalahan pada sistem');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleOpenAdd = () => {
    setEditingEmployee(null);
    setFileList([]);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (record: EmployeeType) => {
    setEditingEmployee(record);
    setFileList([]);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

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

      if (editingEmployee) {
        await axios.patch(`/employee/${editingEmployee.id}`, formData, config);
        message.success('Data berhasil diperbarui');
      } else {
        await axios.post('/employee', formData, config);
        message.success('Data berhasil ditambahkan');
      }

      setIsModalOpen(false);
      setFileList([]);
      fetchEmployees();
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

  const handleDelete = async (id?: string) => {
    try {
      await axios.delete(`/employee/${id}`);
      message.success('Data berhasil dihapus');
      fetchEmployees();
    } catch (err) {
      message.error('Gagal menghapus data');
    }
  };

  const columns: ColumnsType<EmployeeType> = [
    {
      title: 'Foto',
      dataIndex: 'photo',
      key: 'photo',
      render: (photo?: string) =>
        photo ? (
          <Avatar src={`http://localhost:3000/uploads/employees/${photo}`} size={40} />
        ) : (
          <Avatar icon={<UserOutlined />} size={40} />
        ),
    },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Nama', dataIndex: 'nama', key: 'nama' },
    { title: 'Posisi', dataIndex: 'posisi', key: 'posisi' },
    { title: 'Nomer Hp', dataIndex: 'phoneNo', key: 'phoneNo' },
    {
      title: 'Aksi',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            type="link"
            onClick={() => handleOpenEdit(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Hapus employee"
            description="Apakah kamu yakin ingin menghapus data ini?"
            onConfirm={() => handleDelete(record.id)}
            okText="Ya"
            cancelText="Batal"
          >
            <Button icon={<DeleteOutlined />} type="link" danger>
              Hapus
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Card
      >
        <Flex
          justify="space-between"
          align="center"
          wrap="wrap"
          gap="middle"
          style={{ marginBottom: 16 }}
        >
          <Title level={3} style={{ margin: 0 }}>
            Daftar Karyawan
          </Title>

          <Button
            type="primary"
            icon={<PlusOutlined />}
            style={{ width: 'auto' }} 
            onClick={handleOpenAdd}
          >
            Tambah Karyawan
          </Button>
        </Flex>
        <Table
          columns={columns}
          dataSource={employees}
          loading={loading}
          pagination={{ pageSize: 10, responsive: true }}
          scroll={{ x: 'max-content' }}
          style={{marginTop:"20px"}}
        />
      </Card>

      <Modal
        title={editingEmployee ? 'Ubah Karyawan' : 'Tambah Karyawan'}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        okText={editingEmployee ? 'Simpan' : 'Tambah'}
        cancelText="Batal"
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          {/* Tampilkan preview foto saat ini saat edit */}
          {editingEmployee?.photo && fileList.length === 0 && (
            <Form.Item label="Foto Saat Ini">
              <Image
                width={80}
                height={80}
                style={{ objectFit: 'cover', borderRadius: 8 }}
                src={`http://localhost:3000/uploads/employees/${editingEmployee.photo}`}
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
            rules={[
              {
                required: !editingEmployee,
                message: 'Password wajib diisi',
              },
            ]}
          >
            <Input.Password
              placeholder={
                editingEmployee
                  ? 'Kosongkan jika tidak ingin mengubah password'
                  : 'Masukkan Password'
              }
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};