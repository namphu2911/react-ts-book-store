import React from "react";
import { useCurrentApp } from "components/context/app.context.tsx";
import { Button, Result } from "antd";
import { useLocation } from "react-router-dom";

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
                title="404"
                subTitle="Xin lỗi, bạn chưa đăng nhập để truy cập trang này!"
                extra={<Button type="primary">Back Home</Button>}
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
                    title="403"
                    subTitle="Xin lỗi, bạn không có quyền hạn để truy cập trang này!"
                    extra={<Button type="primary">Back Home</Button>}
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