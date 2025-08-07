import React, { useState } from 'react';
import { Table, Space, Button, Tag, Input, Row, Col } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { WrapperStyled, TitleStyled, OrderSearchStyled } from './style';  


function OrderPage() {
  const [searchText, setSearchText] = useState('');
  const orderData = [
    {
      key: '1',
      id: 'ORD-001',
      date: '2023-10-01',
      status: 'COMPLETED',
      total: 120.50,
      items: 3,
      paymentMethod: 'Credit Card'
    },
    {
      key: '2',
      id: 'ORD-002',
      date: '2023-10-05',
      status: 'DELIVERING',
      total: 85.20,
      items: 2,
      paymentMethod: 'PayPal'
    },
    {
      key: '3',
      id: 'ORD-003',
      date: '2023-10-10',
      status: 'PENDING_APPROVAL',
      total: 220.00,
      items: 5,
      paymentMethod: 'Credit Card'
    },
    {
      key: '4',
      id: 'ORD-004',
      date: '2023-10-15',
      status: 'CANCELLED',
      total: 75.30,
      items: 1,
      paymentMethod: 'Cash on Delivery'
    },
  ];
  const statusColors = {
    'PENDING_APPROVAL': 'gold',
    'APPROVED': 'blue',
    'DELIVERING': 'cyan',
    'COMPLETED': 'green',
    'CANCELLED': 'red'
  };
  const columns = [
    {
      title: 'Order ID',
      dataIndex: 'id',
      key: 'id',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={statusColors[status]}>
          {status.replace('_', ' ')}
        </Tag>
      ),
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (amount) => `$${amount.toFixed(2)}`,
    },
    {
      title: 'Items',
      dataIndex: 'items',
      key: 'items',
    },
    {
      title: 'Payment Method',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" size="small">View Details</Button>
          {record.status === 'PENDING_APPROVAL' && (
            <Button danger size="small">Cancel</Button>
          )}
        </Space>
      ),
    },
  ];
  const filteredOrders = orderData.filter(order =>
    order.id.toLowerCase().includes(searchText.toLowerCase()) ||
    order.status.toLowerCase().includes(searchText.toLowerCase()) ||
    order.paymentMethod.toLowerCase().includes(searchText.toLowerCase())
  );
  return (
    <WrapperStyled>
      <Row>
        <Col span={24}>
          <TitleStyled>My Orders</TitleStyled>
          <OrderSearchStyled>
            <Input
              placeholder="Search orders by ID, status or payment method"
              prefix={<SearchOutlined />}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: '400px' }}
            />
          </OrderSearchStyled>
          <Table
            columns={columns}
            dataSource={filteredOrders}
            pagination={{ pageSize: 5 }}
          />
        </Col>
      </Row>
    </WrapperStyled>
  );
}
export default OrderPage;