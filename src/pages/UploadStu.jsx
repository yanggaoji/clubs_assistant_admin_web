import React, { useState } from 'react';
import { Button, Space, Spin, Table, Upload, notification } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { read, utils } from 'xlsx';
import { api_uploadStudent } from '../utils/api';
const columns = [
    {
        title: '学号(stu_id)',
        dataIndex: 'stu_id',
        key: 'stu_id',
    },
    {
        title: '姓名(stu_name)',
        dataIndex: 'stu_name',
        key: 'stu_name',
    },
    {
        title: '备注(ext)',
        key: 'ext',
        dataIndex: 'ext',
    },
];
export default function UploadStu() {
    const [api, contextHolder] = notification.useNotification()
    const [list, setList] = useState([])
    const [readyConfirm, setReadyConfirm] = useState(false)
    const [loading, setLoading] = useState(false)
    const uploadList = async () => {
        setLoading(true)
        const copyList = list.map((val) => {
            return `('${val.stu_id}','${val.stu_name}','${val.ext}')`
        })
        const res = await api_uploadStudent(copyList.join(','))
        setLoading(false)
        api.info({
            message: '上传完成',
        })
    }
    return <>
        <Spin spinning={loading}>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                {readyConfirm ?
                    <Space wrap style={{ margin: '10px 0' }}>
                        <Button danger onClick={uploadList}>核对无误，确认上传</Button>
                        <Button onClick={() => {
                            setList([])
                            setReadyConfirm(false)
                        }}>重新选择文件</Button>
                    </Space>
                    :
                    <Upload beforeUpload={async e => {
                        const workbook = read(await e.arrayBuffer())
                        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                        const raw_data = utils.sheet_to_json(worksheet);
                        setList(raw_data)
                        setReadyConfirm(true)
                        return false
                    }} fileList={[]}>
                        <Button icon={<UploadOutlined />}>点击上传学生excel表格</Button>
                    </Upload>
                }
            </div>
            <Table columns={columns} dataSource={list} rowKey={'stu_id'} />
        </Spin>

    </>
}