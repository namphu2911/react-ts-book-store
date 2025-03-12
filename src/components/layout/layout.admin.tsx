import React, { useEffect, useState } from "react";
import { useCurrentApp } from "components/context/app.context";
import { Avatar, Dropdown, Layout, Menu, MenuProps, Space } from 'antd';
import { Link, Outlet, useLocation } from "react-router-dom";
import {
    AppstoreOutlined,
    DollarCircleOutlined,
    ExceptionOutlined,
    HeartTwoTone,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    TeamOutlined
} from "@ant-design/icons";
import { logoutAPI } from "services/api";
import ManageAccount from "components/client/account/manage.account";

type MenuItem = Required<MenuProps>['items'][number];
const { Content, Footer, Sider } = Layout;

const LayoutAdmin = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [activeMenu, setActiveMenu] = useState('');
    const { user, setUser, isAuthenticated, setIsAuthenticated, setCarts } = useCurrentApp();

    const [openManageAccount, setOpenManageAccount] = useState(false);
    const location = useLocation();

    const handleLogout = async () => {
        const res = await logoutAPI();
        if (res.data) {
            setUser(null);
            setCarts([]);
            setIsAuthenticated(false);
            localStorage.removeItem('access_token');
            localStorage.removeItem("carts");
        }
    }

    const items: MenuItem[] = [
        {
            label: <Link to='/admin'>Dashboard</Link>,
            key: '/admin',
            icon: <AppstoreOutlined />
        },
        {
            label: <Link to='/admin/user'>Manage Users</Link>,
            key: '/admin/user',
            icon: <TeamOutlined />,
        },
        {
            label: <Link to='/admin/book'>Manage Books</Link>,
            key: '/admin/book',
            icon: <ExceptionOutlined />
        },
        {
            label: <Link to='/admin/order'>Manage Orders</Link>,
            key: '/admin/order',
            icon: <DollarCircleOutlined />
        }
    ];

    useEffect(() => {
        const active: any = items.find(item => location.pathname === (item!.key)) ?? "/admin";
        setActiveMenu(active.key)
    }, [location]);

    const itemsDropdown = [
        {
            label: <label
                style={{ cursor: 'pointer' }}
                onClick={() => setOpenManageAccount(true)}
            >Quản lý tài khoản</label>,
            key: 'account',
        },
        {
            label: <Link to={'/'}>Trang chủ</Link>,
            key: 'home',
        },
        {
            label: <label
                style={{ cursor: 'pointer' }}
                onClick={() => handleLogout()}
            >Đăng xuất</label>,
            key: 'logout',
        },
    ];

    const urlAvatar = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${user?.avatar}`;

    if (!isAuthenticated) {
        return (
            <Outlet />
        )
    }

    const isAdminRouter = location.pathname.includes('/admin');
    if (isAuthenticated && isAdminRouter) {
        const role = user?.role;
        if (role !== "ADMIN") {
            return (
                <Outlet />
            )
        }
    }

    return (
        <>
            <Layout
                style={{ minHeight: '100vh' }}
                className="layout-admin"
            >
                <Sider
                    theme='light'
                    collapsible
                    collapsed={collapsed}
                    onCollapse={(value) => setCollapsed(value)}>
                    <div style={{ height: 32, margin: 16, textAlign: 'center' }}>
                        Admin
                    </div>
                    <Menu
                        selectedKeys={[activeMenu]}
                        mode="inline"
                        items={items}
                        onClick={(e) => setActiveMenu(e.key)}
                    />
                </Sider>
                <Layout>
                    <div className='admin-header' style={{
                        height: "50px",
                        borderBottom: "1px solid #ebebeb",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "0 15px",
                    }}>
                        <span>
                            {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                                className: 'trigger',
                                onClick: () => setCollapsed(!collapsed),
                            })}
                        </span>
                        <Dropdown menu={{ items: itemsDropdown }} trigger={['click']}>
                            <Space style={{ cursor: "pointer" }}>
                                <Avatar src={urlAvatar} />
                                {user?.fullName}
                            </Space>
                        </Dropdown>
                    </div>
                    <Content style={{ padding: '15px' }}>
                        <Outlet />
                    </Content>
                    <Footer style={{ padding: 0, textAlign: "center" }}>
                        Book Strore &copy; Phu.nn - Made with <HeartTwoTone />
                    </Footer>
                </Layout>
            </Layout>

            <ManageAccount
                openManageAccount={openManageAccount}
                setOpenManageAccount={setOpenManageAccount}
            />
        </>
    );
};

export default LayoutAdmin;