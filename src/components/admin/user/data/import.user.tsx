import { App, Modal, Upload, Table, UploadProps } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import Exceljs from "exceljs";
import { Buffer } from "buffer";
import { useState } from "react";
import { bulkCreateUserAPI } from "services/api";
import templateFile from "assets/template/templateUser.xlsx?url";
import { isMobile } from 'react-device-detect'

interface IProps {
    openModalImport: boolean;
    setOpenModalImport: (value: boolean) => void;
    refreshTable: () => void;
}

interface IDataImport {
    fullName: string;
    email: string;
    phone: number;
}

interface SheetRowValues {
    [key: string]: string | number | boolean | undefined;
}

const { Dragger } = Upload;

const ImportUser = (props: IProps) => {
    const { openModalImport, setOpenModalImport, refreshTable } = props;
    const [dataImport, setDataImport] = useState<IDataImport[]>([]);
    const [isSubmit, setIsSubmit] = useState<boolean>(false);
    const { message, notification } = App.useApp();

    const propsUpload: UploadProps = {
        name: 'file',
        multiple: true,
        maxCount: 1,
        accept: ".csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        customRequest: ({ onSuccess }) => {
            setTimeout(() => {
                if (onSuccess) onSuccess("ok");
            }, 0);
        },
        async onChange(info) {
            const { status } = info.file;
            if (status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (status === 'done') {
                message.success(`${info.file.name} file uploaded successfully.`);

                if (info.fileList && info.fileList.length > 0) {
                    const file = info.fileList[0].originFileObj!;

                    //load file to buffer
                    const workbook = new Exceljs.Workbook();
                    const arrayBuffer = await file.arrayBuffer()
                    const buffer = Buffer.from(arrayBuffer)
                    await workbook.xlsx.load(buffer);

                    //convert file
                    let jsonData: IDataImport[] = [];
                    workbook.worksheets.forEach(sheet => {
                        // read first row as data keys
                        const firstRow = sheet.getRow(1);
                        if (!firstRow.cellCount) return;
                        const keys: string[] = firstRow.values as string[];
                        sheet.eachRow((row, rowNumber) => {
                            if (rowNumber == 1) return;
                            const values = row.values as (string | number | undefined)[];
                            const obj: SheetRowValues = {};
                            for (let i = 1; i < keys.length; i++) {
                                obj[keys[i]] = values[i];
                            }
                            const dataImportObj: IDataImport = {
                                fullName: obj['fullName'] as string,
                                email: obj['email'] as string,
                                phone: obj['phone'] as number,
                            };
                            jsonData.push(dataImportObj);
                        })
                    });
                    jsonData = jsonData.map((item, index) => {
                        return { ...item, id: index + 1 }
                    })
                    setDataImport(jsonData);
                }
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    };

    const onClose = () => {
        setOpenModalImport(false);
        setDataImport([]);
    }

    const handleImport = async () => {
        setIsSubmit(true);
        const dataSubmit = dataImport.map(item => ({
            fullName: item.fullName,
            email: item.email,
            phone: item.phone,
            password: import.meta.env.VITE_CREATE_USER_PASSWORD,
        }))
        const res = await bulkCreateUserAPI(dataSubmit);
        if (res.data) {
            notification.success({
                message: "Import Success!",
                description: `Thành công: ${res.data.countSuccess}. Thất bại: ${res.data.countError}`
            })
        }
        setIsSubmit(false);
        setOpenModalImport(false);
        setDataImport([]);
        refreshTable();
    }

    return (
        <Modal
            title="Import data user"
            open={openModalImport}
            onOk={() => handleImport()}
            okButtonProps={{
                disabled: dataImport.length <= 0,
                loading: isSubmit,
            }}
            okText={"Import"}
            onCancel={onClose}
            width={isMobile ? "100vw" : "50vw"}
            destroyOnClose={true}
        >
            <Dragger {...propsUpload}>
                <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                </p>
                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                <p className="ant-upload-hint">
                    Support for a single upload. Only accept .csv, .xls, .xlsx file. &nbsp;
                    <a
                        onClick={event => event.stopPropagation()}
                        href={templateFile}
                        download
                    >Download Sample File</a>
                </p>
            </Dragger>
            <div style={{ marginTop: "20px" }}>
                <Table
                    title={() => <span>Dữ liệu upload:</span>}
                    dataSource={dataImport}
                    rowKey="id"
                    pagination={false}
                    columns={[
                        { dataIndex: 'fullName', title: 'Tên Hiển Thị' },
                        { dataIndex: 'email', title: 'Email' },
                        { dataIndex: 'phone', title: 'Số Điện Thoại' }
                    ]}
                />
            </div>
        </Modal>
    )
}

export default ImportUser