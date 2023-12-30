import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input } from 'antd';
import { api_login } from '../utils/api';
import { useState } from 'react';

export default function Login() {
    const [loading, setLoading] = useState(false)
    const onFinish = async (values) => {
        setLoading(true)
        const res = await api_login(values.username, values.password)
        setLoading(false)
        if (!res.success)
            alert(res.msg)
    };

    return (
        <div style={{
            width: '40%', margin: '50px auto', padding: '20px', boxShadow: '#F0F0F0 1px 5px 5px',
            border: '1px solid #d9d9d9', borderRadius: '6px'
        }}>
            <h1>登录系统</h1>
            <Form onFinish={onFinish} >
                <Form.Item name="username" rules={[{ required: true, message: '请输入用户名' }]} >
                    <Input size='large' prefix={<UserOutlined />} placeholder="用户名" />
                </Form.Item>
                <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]} >
                    <Input prefix={<LockOutlined />} type="password" placeholder="密码" size='large' />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" block size='large' loading={loading}>
                        登录
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};
