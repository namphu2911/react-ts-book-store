import { useCurrentApp } from "components/context/app.context";
import { DeleteTwoTone } from "@ant-design/icons";
import { App, Col, Divider, Empty, InputNumber, Row } from "antd";
import { useEffect, useState } from "react";
import "styles/order.scss";

interface IProps {
    setCurrentStep: (value: number) => void;
}

const SeeOrderDetail = (props: IProps) => {
    const { setCurrentStep } = props;

    const { carts, setCarts } = useCurrentApp();
    const [totalPrice, setTotalPrice] = useState(0);

    const { message } = App.useApp();

    useEffect(() => {
        if (carts && carts.length > 0) {
            let sum = 0;
            carts.map(item => {
                sum += item.quantity * item.detail.price;
            })
            setTotalPrice(sum);
        } else {
            setTotalPrice(0);
        }
    }, [carts]);

    const handleOnChangeInput = (value: number, book: IBookTable) => {
        if (!value || +value < 1) {
            return;
        }
        if (!isNaN(+value)) {
            //update localStorage
            const cartStorage = localStorage.getItem("carts");
            if (cartStorage && book) {
                //update
                const carts = JSON.parse(cartStorage) as ICart[];

                //check exist
                const isExistIndex = carts.findIndex(item => item._id === book?._id);
                if (isExistIndex > -1) {
                    carts[isExistIndex].quantity = +value;
                }
                localStorage.setItem("carts", JSON.stringify(carts));
                setCarts(carts);
            }
        }
    }

    const handleRemoveBook = (_id: string) => {
        const cartStorage = localStorage.getItem("carts");
        if (cartStorage) {
            const carts = JSON.parse(cartStorage) as ICart[];
            const newCarts = carts.filter(item => item._id !== _id);
            //update local storage and state
            localStorage.setItem("carts", JSON.stringify(newCarts));
            setCarts(newCarts);
        }
    }

    const handleNextStep = () => {
        if (!carts.length) {
            message.error("Không tồn tài sản phẩm trong giỏ hàng!");
            return;
        }
        setCurrentStep(1);
    }

    return (
        <>
            {carts.length > 0 ?
                <div style={{ background: '#efefef', padding: '20px 0' }}>
                    <div className="order-container" style={{ maxWidth: 1440, margin: '0 auto' }}>
                        <Row gutter={[20, 20]}>
                            <Col md={18} xs={24}>
                                {carts?.map((item, index) => {
                                    const currentBookPrice = item?.detail?.price ?? 0;
                                    return (
                                        <div className="order-book" key={`index-${index}`}>
                                            <div className="book-content">
                                                <img
                                                    src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${item?.detail?.thumbnail}`}
                                                    alt={item?.detail?.thumbnail} />
                                                <div className="title">
                                                    {item?.detail?.mainText}
                                                </div>
                                                <div className="price">
                                                    {new Intl.NumberFormat('vi-VN', {
                                                        style: 'currency',
                                                        currency: 'VND'
                                                    }).format(currentBookPrice)}
                                                </div>
                                            </div>
                                            <div className="action">
                                                <div className="quantity">
                                                    <InputNumber
                                                        onChange={(value) => handleOnChangeInput(value as number, item.detail)}
                                                        value={item.quantity}
                                                    />
                                                </div>
                                                <div className="sum">
                                                    Tổng: {new Intl.NumberFormat('vi-VN', {
                                                        style: 'currency',
                                                        currency: 'VND'
                                                    }).format(currentBookPrice * (item.quantity ?? 0))}
                                                </div>
                                                <DeleteTwoTone
                                                    style={{ cursor: "pointer" }}
                                                    onClick={() => handleRemoveBook(item._id)}
                                                    twoToneColor="#eb2f96"
                                                />
                                            </div>
                                        </div>
                                    )
                                })}
                            </Col>
                            <Col md={6} xs={24}>
                                <div className="order-sum">
                                    <div className="calculate">
                                        <span>Tạm tính:</span>
                                        <span>
                                            {new Intl.NumberFormat('vi-VN', {
                                                style: 'currency',
                                                currency: 'VND'
                                            }).format(totalPrice || 0)}
                                        </span>
                                    </div>
                                    <Divider style={{ margin: "10px 0" }} />
                                    <div className="calculate">
                                        <span>Tổng tiền:</span>
                                        <span className="sum-final">
                                            {new Intl.NumberFormat('vi-VN', {
                                                style: 'currency',
                                                currency: 'VND'
                                            }).format(totalPrice || 0)}
                                        </span>
                                    </div>
                                    <Divider style={{ margin: "10px 0" }} />
                                    <button onClick={() => handleNextStep()}>Mua hàng ({carts?.length ?? 0})</button>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>
                :
                <Empty style={{ padding: '20px 0' }}
                    description="Không có sản phẩm trong giỏ hàng"
                />
            }
        </>
    )
}
export default SeeOrderDetail;