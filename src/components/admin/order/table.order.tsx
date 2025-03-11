import { ActionType, ProColumns, ProTable } from "@ant-design/pro-components";
import { useRef, useState } from "react";
import { getOrdersAPI } from "services/api.ts";
import { dateRangeValidate } from "services/helper.ts";

interface ISearch {
    name: string;
    address: string;
    phone: number;
    createdAt: string;
    createdAtRange: string;
}

const TableOrder = () => {
    const actionRef = useRef<ActionType>();
    const [meta, setMeta] = useState({
        current: 1,
        pageSize: 7,
        pages: 0,
        total: 0
    });

    const columns: ProColumns<IOrderTable>[] = [
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
            render(_dom, entity) {
                return (
                    <a href='#'>{entity._id}</a>
                )
            },
        },
        {
            title: 'Full Name',
            dataIndex: 'name',
            sorter: true,
        },
        {
            title: 'Address',
            dataIndex: 'address',
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            sorter: true,
        },
        {
            title: 'Type',
            dataIndex: 'type',
            sorter: true,
            hideInSearch: true,
        },
        {
            title: 'Giá tiền',
            dataIndex: 'totalPrice',
            hideInSearch: true,
            sorter: true,
            render(_dom, entity) {
                return (
                    <>
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(entity.totalPrice)}
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
    ];

    return (
        <>
            <ProTable<IOrderTable, ISearch>
                columns={columns}
                actionRef={actionRef}
                cardBordered
                request={async (params, sort, filter) => {
                    console.log(params, sort, filter);
                    let query = "";
                    if (params) {
                        query += `current=${params.current}&pageSize=${params.pageSize}`;
                        if (params.name) {
                            query += `&name=/${params.name}/i`
                        }
                        if (params.address) {
                            query += `&address=/${params.address}/i`
                        }
                        if (params.phone) {
                            query += `&phone=/${params.phone}/i`
                        }
                        const createDateRange = dateRangeValidate(params.createdAtRange);
                        if (createDateRange) {
                            query += `&createdAt>=${createDateRange[0]}&createdAt<=${createDateRange[1]}`
                        }
                    }

                    if (sort && sort.name) {
                        query += `&sort=${sort.name === 'ascend' ? 'name' : '-name'}`;
                    }
                    if (sort && sort.phone) {
                        query += `&sort=${sort.phone === 'ascend' ? 'phone' : '-phone'}`;
                    }
                    if (sort && sort.type) {
                        query += `&sort=${sort.type === 'ascend' ? 'type' : '-type'}`;
                    }
                    if (sort && sort.totalPrice) {
                        query += `&sort=${sort.totalPrice === 'ascend' ? 'totalPrice' : '-totalPrice'}`;
                    }
                    if (sort && sort.createdAt) {
                        query += `&sort=${sort.createdAt === 'ascend' ? 'createdAt' : '-createdAt'}`
                    } else {
                        query += `&sort=-createdAt`
                    }

                    const res = await getOrdersAPI(query);
                    if (res.data) {
                        setMeta(res.data.meta);

                        // Handle spilit name and type
                        const modifiedData = res.data.result.map(order => {
                            const [name, type] = order.name.includes('_') ? order.name.split('_') : [order.name, order.type];
                            return {
                                ...order,
                                name,
                                type
                            };
                        });

                        return {
                            data: modifiedData,
                            page: 1,
                            success: true,
                            total: res.data?.meta.total
                        };
                    } else {
                        return {
                            data: undefined,
                            page: 1,
                            success: true,
                            total: undefined
                        };
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
                    pageSizeOptions: ['7', '10', '15', '20', '25', '30'],
                    total: meta.total,
                    showTotal: (total, range) => {
                        return (<div> {range[0]}-{range[1]} of {total} rows</div>)
                    }
                }}
                headerTitle="Table Order"
                search={{
                    defaultCollapsed: false,
                }}
            />
        </>
    );
};

export default TableOrder;