import { useEffect, useState } from "react";
import { getBooksAPI, getDashboardAPI } from "services/api";
import CountUp from "react-countup";
import { Card, Col, Row, Statistic } from "antd";

interface DashboardData {
    countOrder: number;
    countUser: number;
    countBook: number;
}

const AdminDashboard = () => {
    const [dataDashboard, setDataDashboard] = useState<DashboardData>({
        countOrder: 0,
        countUser: 0,
        countBook: 0
    })
    useEffect(() => {
        const initDashboard = async () => {
            try {
                // Chạy API song song để tăng tốc
                const [res, resBook] = await Promise.all([
                    getDashboardAPI(),
                    getBooksAPI("current=1")
                ]);

                // Lấy dữ liệu từ API
                const dashboardData = res?.data || {};
                const countBook = resBook?.data?.meta?.total || 0;

                // Cập nhật state một lần duy nhất
                setDataDashboard(prev => ({
                    ...prev,
                    ...dashboardData,
                    countBook
                }));
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            }
        };

        initDashboard();
    }, []);

    const formatter = (value: any) => <CountUp end={value} separator="," />

    return (
        <Row gutter={[40, 40]}>
            <Col xs={24} md={8}>
                <Card title="" bordered={false} style={{ width: '100%' }}>
                    <Statistic
                        title="Tổng Users"
                        value={dataDashboard.countUser}
                        formatter={formatter}
                    />
                </Card>
            </Col>
            <Col xs={24} md={8}>
                <Card title="" bordered={false} style={{ width: '100%' }}>
                    <Statistic
                        title="Tổng Orders"
                        value={dataDashboard.countOrder}
                        precision={2}
                        formatter={formatter}
                    />
                </Card>
            </Col>
            <Col xs={24} md={8}>
                <Card title="" bordered={false} style={{ width: '100%' }}>
                    <Statistic
                        title="Tổng Books"
                        value={dataDashboard.countBook}
                        precision={2}
                        formatter={formatter}
                    />
                </Card>
            </Col>
        </Row>
    );
}
export default AdminDashboard;