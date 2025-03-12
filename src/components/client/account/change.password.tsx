import { useCurrentApp } from "components/context/app.context";
import { App, Button, Col, Form, FormProps, Input, Row } from "antd";
import { useEffect, useState } from "react";
import { updateUserPasswordAPI } from "services/api";

type FieldType = {
    email: string;
    oldpass: string;
    newpass: string;
};

const ChangePassword = () => {
    const [form] = Form.useForm();
    const { message, notification } = App.useApp();
    const { user } = useCurrentApp();

    const [isSubmit, setIsSubmit] = useState<boolean>(false);

    useEffect(() => {
        if (user) {
            form.setFieldValue("email", user.email);
        }
    }, [user]);

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        const { email, oldpass, newpass } = values;
        setIsSubmit(true);
        const res = await updateUserPasswordAPI(email, oldpass, newpass);
        if (res && res.data) {
            message.success("Cập nhật mật khẩu thành công");
            form.setFieldValue("oldpass", "");
            form.setFieldValue("newpass", "");
        } else {
            notification.error({
                message: "Có lỗi xảy ra",
                description: res.message
            })
        }
        setIsSubmit(false);
    }

    return (
        <div style={{ minHeight: 400 }}>
            <Row>
                <Col sm={24} md={12}></Col>
                <Col sm={24} md={12}>
                    <Form
                        onFinish={onFinish}
                        form={form}
                        name="change-password"
                        autoComplete="off"
                    >
                        <Form.Item<FieldType>
                            labelCol={{ span: 24 }} //whole column
                            label="Email"
                            name="email"
                            rules={[
                                { required: true, message: 'Email không được để trống!' },
                                { type: "email", message: "Email không đúng định dạng!" }
                            ]}
                        >
                            <Input disabled style={{ borderRadius: "5px", height: "40px" }} placeholder="Nhập email..." />
                        </Form.Item>
                        <Form.Item<FieldType>
                            labelCol={{ span: 24 }} //whole column
                            label="Mật khẩu hiện tại"
                            name="oldpass"
                            rules={[{ required: true, message: 'Mật khẩu hiện tại không được để trống!' }]}
                        >
                            <Input.Password style={{ borderRadius: "5px", height: "40px" }}
                                placeholder="Nhập mật khẩu hiện tại..." />
                        </Form.Item>
                        <Form.Item<FieldType>
                            labelCol={{ span: 24 }} //whole column
                            label="Mật khẩu mới"
                            name="newpass"
                            rules={[{ required: true, message: 'Mật khẩu mới không được để trống!' }]}
                        >
                            <Input.Password style={{ borderRadius: "5px", height: "40px" }}
                                placeholder="Nhập mật khẩu mới..." />
                        </Form.Item>
                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={isSubmit}
                            >
                                Xác nhận
                            </Button>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
        </div>
    )
}

export default ChangePassword;