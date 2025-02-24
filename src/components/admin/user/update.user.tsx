import { Form, FormProps, Input, App, Modal } from 'antd';
import { useState, useEffect } from "react";
import { updateUserAPI } from 'services/api';

interface IProps {
    openModalUpdate: boolean;
    setOpenModalUpdate: (value: boolean) => void;
    dataUpdateUser: IUserTable | null;
    setDataUpdateUser: (value: IUserTable | null) => void;
    refreshTable: () => void;
}

interface FieldType {
    _id: string;
    fullName: string;
    email: string;
    phone: number;
}

const UpdateUser = (props: IProps) => {
    const { openModalUpdate, setOpenModalUpdate, dataUpdateUser, setDataUpdateUser, refreshTable } = props;
    const [isSubmit, setIsSubmit] = useState(false);
    const { message, notification } = App.useApp();

    const [form] = Form.useForm();

    useEffect(() => {
        if (dataUpdateUser) {
            form.setFieldsValue({
                _id: dataUpdateUser._id,
                fullName: dataUpdateUser.fullName,
                email: dataUpdateUser.email,
                phone: dataUpdateUser.phone
            })
        }
    }, [dataUpdateUser])

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setIsSubmit(true);
        const { _id, fullName, phone } = values;
        const res = await updateUserAPI(_id, fullName, phone);
        if (res.data) {
            message.success("Đăng ký User thành công!");
            setOpenModalUpdate(false);
            setDataUpdateUser(null);
            form.resetFields();
            refreshTable();
        } else {
            notification.error({
                message: "Cập nhật user thất bại",
                description: res.message,
                duration: 5
            })
        }
        setIsSubmit(false);
    };

    const onClose = () => {
        setOpenModalUpdate(false);
        setDataUpdateUser(null);
        form.resetFields();
    }

    return (
        <Modal
            title="Cập nhật người dùng"
            open={openModalUpdate}
            onOk={() => form.submit()}
            onCancel={onClose}
            okText={"Cập nhật"}
            cancelText={"Hủy"}
            confirmLoading={isSubmit}
        >
            <Form
                form={form}
                name="form-create-user"
                onFinish={onFinish}
                autoComplete="off"
            >
                <Form.Item<FieldType>
                    hidden
                    labelCol={{ span: 24 }} //whole column
                    label="ID"
                    name="_id"
                    rules={[
                        { required: true, message: 'Id không được để trống!' }
                    ]}
                >
                    <Input disabled style={{ borderRadius: "999px", height: "40px" }} placeholder="Nhập id..." />
                </Form.Item>
                <Form.Item<FieldType>
                    labelCol={{ span: 24 }} //whole column
                    label="Email"
                    name="email"
                    rules={[
                        { required: true, message: 'Email không được để trống!' },
                        { type: "email", message: "Email không đúng định dạng!" }
                    ]}
                >
                    <Input disabled style={{ borderRadius: "999px", height: "40px" }} placeholder="Nhập email..." />
                </Form.Item>
                <Form.Item<FieldType>
                    labelCol={{ span: 24 }} //whole column
                    label="Họ tên"
                    name="fullName"
                    rules={[{ required: true, message: 'Họ tên không được để trống!' }]}
                >
                    <Input style={{ borderRadius: "999px", height: "40px" }} placeholder="Nhập họ tên..." />
                </Form.Item>
                <Form.Item<FieldType>
                    labelCol={{ span: 24 }} //whole column
                    label="Số điện thoại"
                    name="phone"
                    rules={[
                        { required: true, message: 'Số điện thoại không được để trống!' },
                        { pattern: new RegExp(/^[0-9]+$/), message: 'Số điện thoại chỉ được chứa số!' },
                        { min: 10, message: 'Số điện thoại không hợp !' }
                    ]}
                >
                    <Input style={{ borderRadius: "999px", height: "40px" }} placeholder="Nhập số điện thoại..." />
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default UpdateUser;