import React, { useEffect, useState } from 'react';
import { Button, Input, Space, Spin, Table, Form, Modal, Avatar, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { api_changeUsernameAndPassword, api_getClubQRcode, api_getClubs, api_img2Cloud, api_removeClub, api_updateClub } from '../utils/api';

var club_description = ''
const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
};
const downloadQR = (base64) => {
    let byteCharacters = atob(
        base64.replace(/^data:image\/(png|jpeg|jpg);base64,/, "")
    );
    let byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    let byteArray = new Uint8Array(byteNumbers);
    let blob = new Blob([byteArray], {
        type: undefined,
    });
    let aLink = document.createElement("a");
    aLink.download = "QR.jpg"; //这里写保存时的图片名称
    aLink.href = URL.createObjectURL(blob);
    aLink.click();
}
export default function Club() {
    const columns = [
        {
            title: '#',
            dataIndex: 'club_id',
            key: 'club_id',
        },
        {
            title: '社团名',
            dataIndex: 'club_name',
            key: 'club_name',
        },
        {
            title: '社团类别',
            dataIndex: 'club_category',
            key: 'club_category'
        },
        {
            title: '人数',
            dataIndex: 'club_count',
            key: 'club_count'
        },
        {
            title: '指导单位',
            dataIndex: 'club_founder',
            key: 'club_founder'
        },
        {
            title: '操作',
            key: 'action',
            render: (e) => {
                return <>
                    <Space size="middle">
                        <a onClick={() => {
                            modifyClubForm.setFieldsValue({
                                club_id: e.club_id,
                                club_name: e.club_name,
                                club_category: e.club_category,
                                club_founder: e.club_founder
                            })
                            setAvatarUrl(e.club_icon)
                            setIsModifyClub(true)
                        }}>修改</a>
                        <a onClick={async () => {
                            setLoading(true)
                            const res = await api_removeClub(e.club_id)
                            console.log(res);
                            fetchData()
                        }}>删除</a>
                        <a onClick={() => {
                            modifyUAndPForm.setFieldValue('club_id', e.club_id)
                            setIsModifyUAndP(true)
                        }}>修改账号密码</a>
                        <a onClick={async () => {
                            setLoading(true)
                            const res = await api_getClubQRcode(e.club_id)
                            setLoading(false)
                            if (res.success) {
                                downloadQR(res.img)
                            }
                        }}>下载专属二维码</a>
                    </Space>
                </>
            },
        },
    ];
    const [list, setList] = useState([])
    const [loading, setLoading] = useState(false)
    const [isModifyClub, setIsModifyClub] = useState(false)
    const [modifyClubForm] = Form.useForm()
    const [avatarUrl, setAvatarUrl] = useState('')
    const [modifyUAndPForm] = Form.useForm()
    const [isModifyUAndP, setIsModifyUAndP] = useState(false)
    const fetchData = (e) => {
        setLoading(true)
        api_getClubs().then(res => {
            if (res.success) {
                setList(res.clubs)
            }
        }).finally(() => {
            setLoading(false)
        })
    }
    useEffect(() => {
        fetchData()
    }, [])
    return <>
        <Spin spinning={loading}>
            <Button type="primary" onClick={() => { setIsModifyClub(true) }}>新增</Button>
            <Table columns={columns} dataSource={list}
                rowKey={'club_id'} />
        </Spin>

        <Modal open={isModifyClub} title="社团" onOk={async () => {
            setLoading(true)
            const res = await api_updateClub({
                club_id: parseInt(modifyClubForm.getFieldValue('club_id')),
                club_name: modifyClubForm.getFieldValue('club_name'),
                club_icon: avatarUrl,
                club_category: modifyClubForm.getFieldValue('club_category'),
                club_founder: modifyClubForm.getFieldValue('club_founder'),
                club_description
            })
            club_description = ''
            setIsModifyClub(false)
            modifyClubForm.resetFields()
            fetchData()
        }} onCancel={() => {
            club_description = ''
            setIsModifyClub(false)
            modifyClubForm.resetFields()
            fetchData()
        }} confirmLoading={loading}>
            <Form labelCol={{ span: 12 }} form={modifyClubForm} initialValues={{
                club_id: '0',
                club_name: '',
                club_category: '',
                club_founder: ''
            }}>
                <Form.Item label="社团ID(club_id)" name="club_id">
                    <Input disabled></Input>
                </Form.Item>
                <Form.Item label="社团名(club_name)" name="club_name">
                    <Input></Input>
                </Form.Item>
                <Form.Item label="社团LOGO(club_icon)">
                    <Upload beforeUpload={e => {
                        getBase64(e, async base64 => {
                            const res = await api_img2Cloud(base64)
                            setAvatarUrl('https://' + res.data.Location)
                        })
                        return false
                    }} fileList={[]}>
                        <Avatar src={avatarUrl} size={'large'} />
                        <Button icon={<UploadOutlined />}>上传新的LOGO</Button>
                    </Upload>
                </Form.Item>
                <Form.Item label="社团分类(club_category)" name="club_category">
                    <Input></Input>
                </Form.Item>
                <Form.Item label="社团业务指导单位(club_founder)" name="club_founder">
                    <Input></Input>
                </Form.Item>
            </Form>

            <div>
                社团简介(club_description):<br />
                此处支持富文本，可以前往<a href="https://xiumi.us/studio/v5#/paper" target="_blank"> 秀米(xiumi.us) </a>
                编辑更加丰富的社团简介，导出并粘贴到此处即可
            </div>

            <div dangerouslySetInnerHTML={{ __html: club_description }} contentEditable onInput={async e => {
                const imgs = e.target.getElementsByTagName('img')
                for (let i = 0; i < imgs.length; i++) {
                    const res = await api_img2Cloud(imgs[i].src)
                    imgs[i].src = 'https://' + res.data.Location
                }
                club_description = e.target.innerHTML;
            }} style={{ border: '#d9d9d9 solid 1px', marginTop: '20px', minHeight: '100px' }} />
        </Modal >

        <Modal open={isModifyUAndP} confirmLoading={loading} onOk={async () => {
            setLoading(true)
            const res = await api_changeUsernameAndPassword(
                modifyUAndPForm.getFieldValue('username'),
                modifyUAndPForm.getFieldValue('password'),
                modifyUAndPForm.getFieldValue('club_id'))
            if (res.success)
                setIsModifyUAndP(false)
            setLoading(false)
        }} onCancel={() => { setIsModifyUAndP(false) }}>
            <br />
            <Form form={modifyUAndPForm} labelCol={{ span: 4 }}>
                <Form.Item label="club_id" name="club_id">
                    <Input disabled></Input>
                </Form.Item>
                <Form.Item label="用户名" name="username">
                    <Input></Input>
                </Form.Item>
                <Form.Item label="密码" name="password">
                    <Input type='password'></Input>
                </Form.Item>
            </Form>
        </Modal >
    </>;
}