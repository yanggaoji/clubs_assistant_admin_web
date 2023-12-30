import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Modal, Space, Spin, Table } from 'antd';
import { api_getStudents, api_removeStudent, api_uploadStudent } from '../utils/api';


export default function Student() {
    const columns = [
        {
            title: '学号',
            dataIndex: 'stu_id',
            key: 'stu_id',
        },
        {
            title: '姓名',
            dataIndex: 'stu_name',
            key: 'stu_name',
        },
        {
            title: '是否已绑定微信',
            dataIndex: 'openid',
            key: 'opendi',
            render: (openid) => {
                if (openid) return '是'
                else return '否'
            }
        },
        {
            title: '操作',
            key: 'action',
            render: (e) => {
                console.log();
                return <Space size="middle">
                    <a onClick={() => {
                        Modal.confirm({
                            title: '是否删除',
                            content: `此操作不可逆，会清除学生 ${e.stu_name} 所有数据`,
                            onOk: async () => {
                                const res = await api_removeStudent(e.stu_id)
                                fetchData()
                            }
                        })
                    }}>删除</a>
                </Space>
            },
        },
    ];
    const [list, setList] = useState([])
    const [loading, setLoading] = useState(false)
    const [pagination, setPagination] = useState({})
    const [newStuForm] = Form.useForm()
    const [isAddStu, setIsAddStu] = useState(false)
    const fetchData = (e = {
        pageSize: 10,
        total: 0,
        current: 1,
        search: ''
    }) => {
        setLoading(true)
        api_getStudents(e.search, e.current, e.pageSize).then(res => {
            if (res.success) {
                setList(res.students)
                setPagination({
                    pageSize: e.pageSize,
                    total: res.total,
                    current: e.current
                })
            }
            console.log(res);
        }).finally(() => {
            setLoading(false)
        })
    }
    useEffect(() => {
        fetchData()
    }, [])
    return <>
        <Spin spinning={loading}>
            <Space wrap style={{ margin: '10px 0' }}>
                <Input.Search addonBefore="姓名" placeholder="输入关键字" allowClear onSearch={e => {
                    fetchData({ search: e })
                }} />
                <Button type="primary" onClick={() => {
                    setIsAddStu(true)
                }}>新增</Button>
                <Button type="primary" onClick={() => {
                    Modal.confirm({
                        title: '是否删除',
                        content: '此操作不可逆，会清除所有数据',
                        onOk: async () => {
                            const res = await api_removeStudent()
                            fetchData()
                        }
                    })
                }}>删除所有学生</Button>
            </Space>
            <Table columns={columns} dataSource={list}
                rowKey={'stu_id'} pagination={pagination} onChange={fetchData} />
        </Spin>
        <Modal open={isAddStu} title="新增学生" onOk={async() => {
            console.log(newStuForm.getFieldValue('stu_id'));
            setLoading(true)
            api_uploadStudent(`('${newStuForm.getFieldValue('stu_id')}','${newStuForm.getFieldValue('stu_name')}','${newStuForm.getFieldValue('ext')}')`).finally(() => {
                fetchData()
            })
            setIsAddStu(false)
        }} onCancel={() => { setIsAddStu(false) }}>
            <Form labelCol={{ span: 6 }} form={newStuForm}>
                <Form.Item label="学号(stu_id)" name="stu_id">
                    <Input></Input>
                </Form.Item>
                <Form.Item label="姓名(stu_name)" name="stu_name">
                    <Input></Input>
                </Form.Item>
                <Form.Item label="ext" name="ext">
                    <Input></Input>
                </Form.Item>
            </Form>
        </Modal>
    </>;
}