import { useState } from "react";
import { App, Button, Divider, Form, FormProps, Input } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { loginAPI } from "services/api.ts";
import 'styles/login.scss';
import { useCurrentApp } from "components/context/app.context";

interface FieldType {
    username: string;
    password: string;
}

const LoginPage = () => {
    const [isSubmit, setIsSubmit] = useState(false);
    const { message, notification } = App.useApp();
    const navigate = useNavigate();
    const { setIsAuthenticated, setUser } = useCurrentApp();

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setIsSubmit(true);
        const { password } = values;
        let { username } = values;
        if (!username.includes("@")) {
            username += "@gmail.com";
        }
        const res = await loginAPI(username, password);
        setIsSubmit(false);
        if (res?.data) {
            setIsAuthenticated(true);
            setUser(res.data.user);
            localStorage.setItem('access_token', res.data.access_token);
            message.success("Đăng nhập thành công!");
            navigate("/");
        } else {
            notification.error({
                message: "Đăng nhập thất bại",
                description:
                    res.message && Array.isArray(res.message) ? res.message[0] : res.message,
                duration: 5
            })
        }
    };

    return (
        <div className="login-page">
            <main className="main">
                <div className="container">
                    <section className="wrapper">
                        <div className="heading">
                            <h2 className="text text-large">Đăng Nhập Tài Khoản</h2>
                            <Divider />
                        </div>
                        <Form
                            name="form-login"
                            onFinish={onFinish}
                            autoComplete="off"
                        >
                            <Form.Item<FieldType>
                                labelCol={{ span: 24 }} //whole column
                                label="Email"
                                name="username"
                                rules={[
                                    { required: true, message: 'Email không được để trống!' },
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
                                    { min: 6, message: 'Mật khẩu phải chứa ít nhất 6 ký tự!' }
                                ]}
                            >
                                <Input.Password style={{ borderRadius: "999px", height: "40px" }}
                                    placeholder="Nhập mật khẩu..." />
                            </Form.Item>
                            <Form.Item style={{ textAlign: "center" }}>
                                <Button type="primary" htmlType="submit" loading={isSubmit}>
                                    Đăng Nhập
                                </Button>
                            </Form.Item>
                            <Divider>Or</Divider>
                            <p className="text text-normal" style={{ textAlign: "center" }}>
                                Chưa có tài khoản ?
                                <span>
                                    <Link to='/register'> Đăng Ký </Link>
                                </span>
                            </p>
                            <p className="text text-normal" style={{ textAlign: "center" }}>
                                <span>
                                    <Link to='/'> Trang chủ </Link>
                                </span>
                            </p>
                        </Form>
                    </section>
                </div>
            </main>
        </div>
    )
}

export default LoginPage;