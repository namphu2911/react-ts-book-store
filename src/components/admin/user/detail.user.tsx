import { Avatar, Badge, Descriptions, Drawer } from "antd";
import dayjs from "dayjs";
import { FORMATE_DATE_VN } from "services/helper.ts";

interface IProps {
    openDrawer: boolean;
    setOpenDrawer: (value: boolean) => void;
    dataUser: IUserTable | null;
    setDataUser: (value: IUserTable | null) => void;
}

const UserDetail = (props: IProps) => {
    const { openDrawer, setOpenDrawer, dataUser, setDataUser } = props;

    const onClose = () => {
        setOpenDrawer(false);
        setDataUser(null);
    };

    const avatarURL = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${dataUser?.avatar}`;

    return (
        <Drawer
            title="Chức năng xem chi tiết"
            onClose={onClose}
            open={openDrawer}
            width={"45vw"} >

            <Descriptions
                title="Thông tin người dùng"
                bordered
                column={2} >
                <Descriptions.Item label="ID">{dataUser?._id}</Descriptions.Item>
                <Descriptions.Item label="Tên Hiển Thị">{dataUser?.fullName}</Descriptions.Item>
                <Descriptions.Item label="Email">{dataUser?.email}</Descriptions.Item>
                <Descriptions.Item label="Số Điện Thoại">{dataUser?.phone}</Descriptions.Item>
                <Descriptions.Item label="Role">
                    <Badge status="processing" text={dataUser?.role} />
                </Descriptions.Item>
                <Descriptions.Item label="Avatar">
                    <Avatar size={40} src={avatarURL}></Avatar>
                </Descriptions.Item>
                <Descriptions.Item label="Ngày Đăng Ký">
                    {dayjs(dataUser?.createdAt).format(FORMATE_DATE_VN)}
                </Descriptions.Item>
                <Descriptions.Item label="Ngày Cập Nhật">
                    {dayjs(dataUser?.updatedAt).format(FORMATE_DATE_VN)}
                </Descriptions.Item>
            </Descriptions>
        </Drawer>
    );
};

export default UserDetail;