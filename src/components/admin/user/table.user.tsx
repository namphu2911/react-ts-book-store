import { ActionType, ProColumns, ProTable } from "@ant-design/pro-components";
import { Button } from "antd";
import { useRef, useState } from "react";
import { DeleteTwoTone, EditTwoTone, PlusOutlined } from "@ant-design/icons";
import { getUsersAPI } from "services/api.ts";

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
                <a href='#'>{entity._id}</a>
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
        copyable: true,
        ellipsis: true,
    },
    {
        title: 'Updated At',
        dataIndex: 'updatedAt',
        copyable: true,
        ellipsis: true,
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

const TableUser = () => {
    const actionRef = useRef<ActionType>();
    const [meta, setMeta] = useState({
        current: 1,
        pageSize: 5,
        pages: 0,
        total: 0
    });

    return (
        <>
            <ProTable<IUserTable>
                columns={columns}
                actionRef={actionRef}
                cardBordered
                request={async (params, sort, filter) => {
                    console.log(params, sort, filter);
                    const res = await getUsersAPI(params?.current ?? 1, params?.pageSize ?? 5);
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
            />
        </>
    );
};

export default TableUser;