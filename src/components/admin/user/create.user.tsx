import { Form, FormProps, Input, App, Modal } from 'antd';
import { useState } from "react";
import { createUserAPI } from 'services/api';

interface IProps {
    openModalCreate: boolean;
    setOpenModalCreate: (value: boolean) => void;
    refreshTable: () => void;
}

interface FieldType {
    fullName: string;
    email: string;
    password: string;
    phone: number;
}

const CreateUser = (props: IProps) => {
    const { openModalCreate, setOpenModalCreate, refreshTable } = props;
    const [isSubmit, setIsSubmit] = useState(false);
    const { message, notification } = App.useApp();

    const [form] = Form.useForm();

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setIsSubmit(true);
        const { fullName, email, password, phone } = values;
        const res = await createUserAPI(fullName, email, password, phone);
        if (res.data) {
            message.success("Đăng ký User thành công!");
            setOpenModalCreate(false);
            form.resetFields();
            refreshTable();
        } else {
            notification.error({
                message: "Đăng ký user thất bại",
                description:
                    res.message && Array.isArray(res.message) ? res.message[0] : res.message,
                duration: 5
            })
        }
        setIsSubmit(false);
    };

    const onClose = () => {
        setOpenModalCreate(false);
        form.resetFields();
    }

    return (
        <Modal
            title="Thêm mới người dùng"
            open={openModalCreate}
            onOk={() => form.submit()}
            onCancel={onClose}
            okText={"Thêm mới"}
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
                    labelCol={{ span: 24 }} //whole column
                    label="Họ tên"
                    name="fullName"
                    rules={[{ required: true, message: 'Họ tên không được để trống!' }]}
                >
                    <Input style={{ borderRadius: "999px", height: "40px" }} placeholder="Nhập họ tên..." />
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
                    <Input style={{ borderRadius: "999px", height: "40px" }} placeholder="Nhập email..." />
                </Form.Item>
                <Form.Item<FieldType>
                    labelCol={{ span: 24 }} //whole column
                    label="Mật khẩu"
                    name="password"
                    rules={[
                        { required: true, message: 'Mật khẩu không được để trống!' },
                        { min: 6, message: 'Mật khẩu phải chứa ít nhất 6 ký tự' }
                    ]}
                >
                    <Input.Password style={{ borderRadius: "999px", height: "40px" }} placeholder="Nhập mật khẩu..." />
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
export default CreateUser;