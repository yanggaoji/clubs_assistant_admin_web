import React, { useEffect, useState } from 'react';
import {
    CloudDownloadOutlined,
    ContactsFilled,
    CloudUploadOutlined,
    ContainerFilled
} from '@ant-design/icons';
import { Layout, Menu, theme } from 'antd';
import Title from 'antd/es/typography/Title';
import { Outlet, useNavigate } from 'react-router';


const { Header, Content, Footer, Sider } = Layout;
const items = [
    { label: '学生管理', icon: <ContactsFilled />, key: 'student' },
    { label: '社团管理', icon: <ContainerFilled />, key: 'club' },
    { label: '数据导出', icon: <CloudDownloadOutlined />, key: 'download' },
    { label: '数据导入', icon: <CloudUploadOutlined />, key: 'upload' },
    { label: '退出登录', key: 'exit' }
];

export default function Index(e) {
    const [collapsed, setCollapsed] = useState(false);
    const { token: { colorBgContainer } } = theme.useToken();
    const navigate = useNavigate();
    useEffect(() => {
        navigate('student')
    }, [])
    return (
        <Layout
            style={{
                minHeight: '100vh',
            }}
        >
            <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                <Menu theme="dark" defaultSelectedKeys={['student']} mode="inline" items={items} onClick={e => {
                    if (e.key == 'exit') {
                        window.localStorage.clear()
                        window.location.href = '/#/login'
                        return
                    }
                    navigate(e.key)
                }} />
            </Sider>
            <Layout>
                <Header style={{
                    background: colorBgContainer, display: 'flex', alignItems: 'center', padding: '0 20px'
                }} >
                    <Title level={4} style={{ margin: 0 }}>聊大社团助手管理后台</Title>
                </Header>
                <Content style={{ margin: '10px 16px' }}>
                    <div
                        style={{
                            padding: 24,
                            minHeight: 360,
                            background: colorBgContainer,
                        }}
                    >
                        <Outlet />
                    </div>
                </Content>
                <Footer
                    style={{
                        textAlign: 'center',
                    }}
                >
                    LDSTZS ©2023 Created by Carl
                </Footer>
            </Layout>
        </Layout>
    );
};