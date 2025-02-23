import React from "react";
import { useCurrentApp } from "components/context/app.context";
import { Button, Result } from "antd";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";

interface IProps {
    children: React.ReactNode;
}

const ProtectedRoute = (props: IProps) => {
    const { isAuthenticated, user } = useCurrentApp();
    const location = useLocation();
    const { children } = props;

    if (!isAuthenticated) {
        return (
            <Result
                status="404"
                title="Not Login"
                subTitle="Bạn cần đăng nhập để sử dụng tính năng này!"
                extra={
                    <Button type="primary">
                        <Link to="/login">Đăng Nhập</Link>
                    </Button>}
            />
        )
    }

    const isAdminRouter = location.pathname.includes("admin");
    if (isAuthenticated && isAdminRouter) {
        const role = user?.role;
        if (role !== "ADMIN") {
            return (
                <Result
                    status="403"
                    title="Not Authorization"
                    subTitle="Tài khoản của bạn không có quyền hạn truy cập trang này!"
                    extra={
                        <Button type="primary">
                            <Link to="/">Back Home</Link>
                        </Button>}
                />
            )
        }
    }

    return (
        <>
            {children}
        </>
    )
}
export default ProtectedRoute;