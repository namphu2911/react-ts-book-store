import SeeBookDetail from "components/client/book/see.book.detail";
import { App } from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getBookByIdAPI } from "@/services/api";
import BookLoader from "components/client/book/book.loader";

const BookPage = () => {
    const { id } = useParams();
    const { notification } = App.useApp();
    const [currentBook, setCurrentBook] = useState<IBookTable | null>(null);
    const [isLoadingBook, setIsLoadingBook] = useState<boolean>(true);

    useEffect(() => {
        if (id) {
            const fetchBookById = async () => {
                setIsLoadingBook(true);
                const res = await getBookByIdAPI(id);
                if (res && res.data) {
                    setCurrentBook(res.data);
                } else {
                    notification.error({
                        message: 'Đã có lỗi xảy ra',
                        description: res.message
                    })
                }
                setIsLoadingBook(false);
            }
            fetchBookById();
        }
    }, [id]);

    return (
        <>
            {isLoadingBook ?
                <BookLoader />
                :
                <SeeBookDetail
                    currentBook={currentBook}
                />
            }
        </>
    )
}
export default BookPage;