import { ActionType, ProColumns, ProTable } from "@ant-design/pro-components";
import { Button } from "antd";
import { useRef, useState } from "react";
import { DeleteTwoTone, EditTwoTone, PlusOutlined } from "@ant-design/icons";
import { getUsersAPI } from "services/api.ts";
import { dateRangeValidate } from "services/helper.ts";
import UserDetail from "components/admin/user/detail.user.tsx";


interface ISearch {
    fullName: string;
    email: string;
    phone: string;
    createdAt: string;
    createdAtRange: string;
    updatedAt: string;
    updatedAtRange: string;
}

const TableUser = () => {
    const actionRef = useRef<ActionType>();
    const [openDrawer, setOpenDrawer] = useState(false);
    const [dataUser, setDataUser] = useState<IUserTable | null>(null);
    const [meta, setMeta] = useState({
        current: 1,
        pageSize: 5,
        pages: 0,
        total: 0
    });

    const columns: ProColumns<IUserTable>[] = [
        {
            dataIndex: 'index',
            valueType: 'indexBorder',
            width: 48,
        },
        {
            title: 'Id',
            dataIndex: '_id',
            ellipsis: true,
            hideInSearch: true,
            render(_, entity) {
                return (
                    <a
                        onClick={() => {
                            setOpenDrawer(true);
                            setDataUser(entity);
                        }}
                        href='#'
                    >{entity._id}</a>
                )
            },
        },
        {
            title: 'Full Name',
            dataIndex: 'fullName',
            copyable: true,
            ellipsis: true,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            copyable: true,
            ellipsis: true,
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            // copyable: true,
            ellipsis: true,
        },
        {
            title: 'Role',
            dataIndex: 'role',
            // copyable: true,
            ellipsis: true,
            hideInSearch: true,
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            valueType: 'date',
            sorter: true,
            hideInSearch: true
        },
        {
            title: 'Created At',
            dataIndex: 'createdAtRange',
            valueType: 'dateRange',
            hideInTable: true,
        },
        {
            title: 'Updated At',
            dataIndex: 'updatedAt',
            valueType: 'date',
            sorter: true,
            hideInSearch: true
        },
        {
            title: 'Updated At',
            dataIndex: 'updatedAtRange',
            valueType: 'dateRange',
            hideInTable: true
        },
        {
            title: 'Action',
            hideInSearch: true,
            render() {
                return (
                    <>
                        <EditTwoTone
                            twoToneColor="#f57800"
                            style={{ cursor: "pointer", marginRight: 15 }}
                        />
                        <DeleteTwoTone
                            twoToneColor="#ff4d4f"
                            style={{ cursor: "pointer" }}
                        />
                    </>
                )
            }
        }
    ];

    return (
        <>
            <ProTable<IUserTable, ISearch>
                columns={columns}
                actionRef={actionRef}
                cardBordered
                request={async (params, sort, filter) => {
                    console.log(params, sort, filter);
                    let query = "";
                    if (params) {
                        query += `current=${params.current}&pageSize=${params.pageSize}`
                        if (params.email) {
                            query += `&email=/${params.email}/i`
                        }
                        if (params.fullName) {
                            query += `&fullName=/${params.fullName}/i`
                        }
                        if (params.phone) {
                            query += `&phone=/${params.phone}/i`
                        }
                        const createDateRange = dateRangeValidate(params.createdAtRange);
                        if (createDateRange) {
                            query += `&createdAt>=${createDateRange[0]}&createdAt<=${createDateRange[1]}`
                        }
                        const updateDateRange = dateRangeValidate(params.updatedAtRange);
                        if (updateDateRange) {
                            query += `&createdAt>=${updateDateRange[0]}&createdAt<=${updateDateRange[1]}`
                        }
                    }

                    if (sort && sort.createdAt) {
                        query += `&sort=${sort.createdAt === 'ascend' ? 'createdAt' : '-createdAt'}`
                    }
                    if (sort && sort.updatedAt) {
                        query += `&sort=${sort.updatedAt === 'ascend' ? 'updatedAt' : '-updatedAt'}`
                    }

                    const res = await getUsersAPI(query);
                    if (res.data) {
                        setMeta(res.data.meta);
                    }
                    return {
                        data: res.data?.result,
                        page: 1,
                        success: true,
                        total: res.data?.meta.total
                    }
                }}
                rowKey="_id"
                options={{
                    setting: {
                        listsHeight: 400,
                    },
                }}
                pagination={{
                    current: meta.current,
                    pageSize: meta.pageSize,
                    showSizeChanger: true,
                    pageSizeOptions: ['5', '10', '15', '20', '25', '30'],
                    total: meta.total,
                    showTotal: (total, range) => { return (<div> {range[0]}-{range[1]} of {total} rows</div>) }
                }}
                dateFormatter="string"
                headerTitle="Table user"
                toolBarRender={() => [
                    <Button
                        key="button"
                        icon={<PlusOutlined />}
                        onClick={() => {
                            actionRef.current?.reload();
                        }}
                        type="primary"
                    >
                        Add new
                    </Button>
                ]}
                search={{
                    defaultCollapsed: false,
                }}
            />
            <UserDetail
                openDrawer={openDrawer}
                setOpenDrawer={setOpenDrawer}
                dataUser={dataUser}
                setDataUser={setDataUser}
            />
        </>
    );
};

export default TableUser;