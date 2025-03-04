import { ActionType, ProColumns, ProTable } from "@ant-design/pro-components";
import { Button, Popconfirm } from "antd";
import { useRef, useState } from "react";
import { CloudUploadOutlined, DeleteTwoTone, EditTwoTone, ExportOutlined, PlusOutlined } from "@ant-design/icons";
import { getBooksAPI } from "services/api.ts";
import { dateRangeValidate } from "services/helper.ts";
import { CSVLink } from "react-csv";
import CreateBook from "components/admin/book/create.book";
import BookDetail from "components/admin/book/detail.book";
import UpdateBook from "components/admin/book/update.book";

interface ISearch {
    mainText: string;
    category: string;
    author: string;
    quantity: number;
    price: number;
    createdAt: string;
    createdAtRange: string;
    updatedAt: string;
    updatedAtRange: string;
}

const TableBook = () => {
    const actionRef = useRef<ActionType>();
    const [openDrawer, setOpenDrawer] = useState(false);
    const [dataBook, setDataBook] = useState<IBookTable | null>(null);

    const [dataUpdateBook, setDataUpdateBook] = useState<IBookTable | null>(null);

    const [openModalCreate, setOpenModalCreate] = useState(false);

    //const [openModalImport, setOpenModalImport] = useState(false);
    const [openModalUpdate, setOpenModalUpdate] = useState(false);
    const [currentDataTable, setCurrentDataTable] = useState<IBookTable[]>([]);
    //const [isDeleteUser, setIsDeleteUser] = useState<boolean>(false);
    //const { message, notification } = App.useApp();

    const [meta, setMeta] = useState({
        current: 1,
        pageSize: 5,
        pages: 0,
        total: 0
    });

    // const handleDeleteUser = async (_id: string) => {
    //     setIsDeleteUser(true);
    //     const res = await deleteUserAPI(_id);
    //     if (res.data) {
    //         message.success("Xóa User thành công!");
    //         refreshTable();
    //     } else {
    //         notification.error({
    //             message: "Xóa user thất bại",
    //             description: res.message,
    //             duration: 5
    //         })
    //     }
    //     setIsDeleteUser(false);
    // };

    const columns: ProColumns<IBookTable>[] = [
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
                            setDataBook(entity);
                        }}
                        href='#'
                    >{entity._id}</a>
                )
            },
        },
        {
            title: 'Tên Sách',
            dataIndex: 'mainText',
            copyable: true,
            ellipsis: true,
            sorter: true,
        },
        {
            title: 'Tác Giả',
            dataIndex: 'author',
            copyable: true,
            ellipsis: true,
            sorter: true,
        },
        {
            title: 'Thể Loại',
            dataIndex: 'category',
            ellipsis: true,
            sorter: true,
        },
        {
            title: 'Số Lượng',
            dataIndex: 'quantity',
            ellipsis: true,
            hideInSearch: true,
            sorter: true,
        },
        {
            title: 'Giá Tiền',
            dataIndex: 'price',
            ellipsis: true,
            hideInSearch: true,
            sorter: true,
            render(_, entity) {
                return (
                    <>
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(entity.price)}
                    </>
                )
            }
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
            render(_, entity) {
                return (
                    <>
                        <EditTwoTone
                            twoToneColor="#f57800"
                            style={{ cursor: "pointer", marginRight: 15 }}
                            onClick={() => {
                                setOpenModalUpdate(true);
                                setDataUpdateBook(entity);
                            }}
                        />
                        <Popconfirm
                            title="Xác nhận xóa user"
                            description="Bạn có chắc chắn muốn xóa user này?"
                            //onConfirm={() => handleDeleteUser(entity._id)}
                            okText="Yes"
                            cancelText="No"
                            okButtonProps={{
                                //loading: isDeleteUser,
                            }}
                        >
                            <DeleteTwoTone
                                twoToneColor="#ff4d4f"
                                style={{ cursor: "pointer" }}
                            />
                        </Popconfirm>
                    </>
                )
            }
        }
    ];

    const refreshTable = () => {
        actionRef.current?.reload();
    }

    return (
        <>
            <ProTable<IBookTable, ISearch>
                columns={columns}
                actionRef={actionRef}
                cardBordered
                request={async (params, sort, filter) => {
                    console.log(params, sort, filter);
                    let query = "";
                    if (params) {
                        query += `current=${params.current}&pageSize=${params.pageSize}`
                        if (params.mainText) {
                            query += `&mainText=/${params.mainText}/i`
                        }
                        if (params.category) {
                            query += `&category=/${params.category}/i`
                        }
                        if (params.author) {
                            query += `&author=/${params.author}/i`
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

                    if (sort && sort.mainText) {
                        query += `&sort=${sort.mainText === 'ascend' ? 'mainText' : '-mainText'}`;
                    }
                    if (sort && sort.category) {
                        query += `&sort=${sort.category === 'ascend' ? 'category' : '-category'}`;
                    }
                    if (sort && sort.author) {
                        query += `&sort=${sort.author === 'ascend' ? 'author' : '-author'}`;
                    }
                    if (sort && sort.quantity) {
                        query += `&sort=${sort.quantity === 'ascend' ? 'quantity' : '-quantity'}`;
                    }
                    if (sort && sort.price) {
                        query += `&sort=${sort.price === 'ascend' ? 'price' : '-price'}`;
                    }
                    if (sort && sort.createdAt) {
                        query += `&sort=${sort.createdAt === 'ascend' ? 'createdAt' : '-createdAt'}`;
                    } else {
                        query += `&sort=-createdAt`;
                    }
                    if (sort && sort.updatedAt) {
                        query += `&sort=${sort.updatedAt === 'ascend' ? 'updatedAt' : '-updatedAt'}`
                    }

                    const res = await getBooksAPI(query);
                    if (res.data) {
                        setMeta(res.data.meta);
                        setCurrentDataTable(res.data?.result ?? []);
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
                    showTotal: (total, range) => {
                        return (<div> {range[0]}-{range[1]} of {total} rows</div>)
                    }
                }}
                dateFormatter="string"
                headerTitle="Table Book"
                toolBarRender={() => [
                    <Button
                        key="button"
                        icon={<ExportOutlined />}
                        type="primary"
                    >
                        <CSVLink
                            data={currentDataTable}
                            filename={"user-data-export.csv"}
                        >
                            Export
                        </CSVLink>
                    </Button>,
                    <Button
                        key="button"
                        icon={<CloudUploadOutlined />}
                        onClick={() => {
                            //setOpenModalImport(true);
                        }}
                        type="primary"
                    >
                        Import
                    </Button>,
                    <Button
                        key="button"
                        icon={<PlusOutlined />}
                        onClick={() => {
                            setOpenModalCreate(true);
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
            <CreateBook
                openModalCreate={openModalCreate}
                setOpenModalCreate={setOpenModalCreate}
                refreshTable={refreshTable}
            />
            <BookDetail
                openDrawer={openDrawer}
                setOpenDrawer={setOpenDrawer}
                dataBook={dataBook}
                setDataBook={setDataBook}
            />
            <UpdateBook
                dataUpdateBook={dataUpdateBook}
                setDataUpdateBook={setDataUpdateBook}
                openModalUpdate={openModalUpdate}
                setOpenModalUpdate={setOpenModalUpdate}
                refreshTable={refreshTable}
            />
        </>
    );
};

export default TableBook;