import type { FormProps } from 'antd';
import { Button, Form, Input, Divider, App } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from "react";
import 'styles/register.scss';
import { registerAPI } from 'services/api';

interface FieldType {
    fullName: string;
    email: string;
    password: string;
    phone: number;
}

const RegisterPage = () => {
    const [isSubmit, setIsSubmit] = useState(false);
    const { message, notification } = App.useApp();
    const navigate = useNavigate();

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setIsSubmit(true);
        const { fullName, email, password, phone } = values;
        const res = await registerAPI(fullName, email, password, phone);
        if (res.data) {
            message.success("Đăng ký User thành công!");
            navigate("/login");
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

    return (
        <div className="register-page">
            <main className="main">
                <div className="container">
                    <section className="wrapper">
                        <div className="heading">
                            <h2 className="text text-large">Đăng Ký Tài Khoản</h2>
                            <Divider />
                        </div>
                        <Form
                            name="form-register"
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
                            <Form.Item style={{ textAlign: "center" }}>
                                <Button type="primary" htmlType="submit" loading={isSubmit}>
                                    Đăng ký
                                </Button>
                            </Form.Item>
                            <Divider>Or</Divider>
                            <p className="text text-normal" style={{ textAlign: "center" }}>
                                Đã có tài khoản ?
                                <span>
                                    <Link to='/login' > Đăng Nhập </Link>
                                </span>
                            </p>
                        </Form>
                    </section>
                </div>
            </main>
        </div>
    )
}
export default RegisterPage;