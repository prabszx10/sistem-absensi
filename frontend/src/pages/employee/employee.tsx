import React, { useEffect, useState } from 'react';
import { Table, Space, Button, Card, Modal, Form, Input, Popconfirm, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';

interface EmployeeType {
  key?: string;
  id?: string;
  email: string;
  nama: string;
  posisi: string;
  phoneNo: string;
}

export const EmployeePage: React.FC = () => {
  const [employees, setEmployees] = useState<EmployeeType[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<EmployeeType | null>(null);

  const [form] = Form.useForm();

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/employee');
      const dataWithKeys = res.data.map((item: any) => ({ ...item, key: item.id }));
      setEmployees(dataWithKeys);
    } catch (err) {
      setEmployees([
        { key: '1', id: '1', nama: 'Arian', email: 'arian@example.com', posisi: 'Developer', phoneNo: '08123456789' },
        { key: '2', id: '2', nama: 'Dicky Prabowo Octiantto', email: 'dicky@example.com', posisi: 'Manager', phoneNo: '08987654321' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Open Modal Add
  const handleOpenAdd = () => {
    setEditingEmployee(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  // Open Modal Edit
  const handleOpenEdit = (record: EmployeeType) => {
    setEditingEmployee(record);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  // Submit Handler Add / Edit
  const handleSubmit = async (values: EmployeeType) => {
    try {
      if (editingEmployee) {
        await axios.patch(`/employee/${editingEmployee.id}`, values);
        message.success('Data berhasil diperbarui');
      } else {
        await axios.post('/employee', values);
        message.success('Data berhasil ditambahkan');
      }
      setIsModalOpen(false);
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

  // Delete Handler
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
        title="Daftar Employee"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleOpenAdd}>
            Tambah Employee
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={employees}
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title={editingEmployee ? 'Edit Employee' : 'Tambah Employee'}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        okText={editingEmployee ? 'Simpan' : 'Tambah'}
        cancelText="Batal"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
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
            rules={[{ required: true, message: 'Password Wajib diisi' }]}
          >
            <Input placeholder="Masukkan Password" type={'password'} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};