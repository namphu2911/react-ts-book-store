import { Modal, Tabs, TabsProps } from "antd";
import UserInfo from "components/client/account/user.info"
import ChangePassword from "components/client/account/change.password"
import { isMobile } from 'react-device-detect'

interface IProps {
    openManageAccount: boolean;
    setOpenManageAccount: (value: boolean) => void;
}

const ManageAccount = (props: IProps) => {
    const { openManageAccount, setOpenManageAccount } = props;

    const items: TabsProps['items'] = [
        {
            key: 'info',
            label: 'Cập nhật thông tin',
            children: <UserInfo />
        },
        {
            key: 'password',
            label: 'Đổi mật khẩu',
            children: <ChangePassword />
        }
    ];

    return (
        <Modal
            title="Quản lý tài khoản"
            open={openManageAccount}
            footer={null}
            onCancel={() => setOpenManageAccount(false)}
            maskClosable={false}
            width={isMobile ? '90vw' : '60vw'}
        >
            <Tabs defaultActiveKey="info" items={items} />
        </Modal>
    )
};

export default ManageAccount;