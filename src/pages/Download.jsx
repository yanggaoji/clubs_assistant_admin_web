import { Button, Spin } from "antd";
import { utils, writeFile } from "xlsx";
import { api_exportData } from "../utils/api";
import { useState } from "react";

export default function Download() {
    // utils.json_to_sheet()
    const fetchData = async () => {
        setLoading(true)
        const res = await api_exportData()
        console.log(res);
        if (res.success) {
            const worksheet = utils.json_to_sheet(res.data)
            const workbook = utils.book_new();
            utils.book_append_sheet(workbook, worksheet, "data");
            writeFile(workbook, "output.xlsx", { compression: true });
        }
        setLoading(false)
    }
    const [loading, setLoading] = useState(false)
    return <>
        <Spin spinning={loading}>
            <p>注意，该操作会消耗大量的资源，请尽量减少操作次数</p>
            <Button type="primary" onClick={fetchData}>开始导出数据库</Button>
        </Spin>
    </>
}