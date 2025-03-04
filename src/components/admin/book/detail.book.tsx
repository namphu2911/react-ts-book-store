import { Badge, Descriptions, Divider, Drawer, GetProp, Image, Upload, UploadFile } from "antd";
import { UploadProps } from "antd/lib";
import dayjs from "dayjs";
import { FORMATE_DATE_VN } from "services/helper.ts";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

interface IProps {
    openDrawer: boolean;
    setOpenDrawer: (value: boolean) => void;
    dataBook: IBookTable | null;
    setDataBook: (value: IBookTable | null) => void;
}

interface ThumbnailFile extends UploadFile {
    uid: string;
    name: string;
    status: 'done';
    url: string;
}

const BookDetail = (props: IProps) => {
    const { openDrawer, setOpenDrawer, dataBook, setDataBook } = props;
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');

    const [fileList, setFileList] = useState<UploadFile[]>([]);
    useEffect(() => {
        if (dataBook) {
            const imgThumbnail: ThumbnailFile | undefined = dataBook.thumbnail
                ? {
                    uid: uuidv4(),
                    name: dataBook.thumbnail,
                    status: 'done',
                    url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${dataBook.thumbnail}`,
                }
                : undefined;

            const imgSlider: ThumbnailFile[] = dataBook.slider?.map((item): ThumbnailFile => ({
                uid: uuidv4(),
                name: item,
                status: 'done',
                url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
            })) || [];

            // Kết hợp imgThumbnail (nếu tồn tại) và imgSlider
            const combinedFiles: ThumbnailFile[] = [
                ...(imgThumbnail ? [imgThumbnail] : []),
                ...imgSlider,
            ];

            setFileList(combinedFiles as UploadFile[]);
        }
    }, [dataBook]);

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }
        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    };

    const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    }

    const getBase64 = (file: FileType): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });

    const onClose = () => {
        setOpenDrawer(false);
        setDataBook(null);
    };

    return (
        <Drawer
            title="Chức năng xem chi tiết"
            onClose={onClose}
            open={openDrawer}
            width={"45vw"} >

            <Descriptions
                title="Thông tin sách"
                bordered
                column={2} >
                <Descriptions.Item label="ID">{dataBook?._id}</Descriptions.Item>
                <Descriptions.Item label="Tên Sách">{dataBook?.mainText}</Descriptions.Item>
                <Descriptions.Item label="Tác Giả">{dataBook?.author}</Descriptions.Item>
                <Descriptions.Item label="Giá Tiền">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(dataBook?.price ?? 0)}
                </Descriptions.Item>
                <Descriptions.Item label="Thể Loại">
                    <Badge status="processing" text={dataBook?.category} />
                </Descriptions.Item>
                <Descriptions.Item label="Số Lượng">{dataBook?.quantity}</Descriptions.Item>
                <Descriptions.Item label="Ngày Đăng">
                    {dayjs(dataBook?.createdAt).format(FORMATE_DATE_VN)}
                </Descriptions.Item>
                <Descriptions.Item label="Ngày Cập Nhật">
                    {dayjs(dataBook?.updatedAt).format(FORMATE_DATE_VN)}
                </Descriptions.Item>
            </Descriptions>
            <Divider orientation="left"> Ảnh Books </Divider>
            <Upload
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                listType="picture-card"
                fileList={fileList}
                onPreview={handlePreview}
                onChange={handleChange}
                showUploadList={
                    { showRemoveIcon: false }
                }
            >
            </Upload>
            {previewImage && (
                <Image
                    wrapperStyle={{ display: 'none' }}
                    preview={{
                        visible: previewOpen,
                        onVisibleChange: (visible) => setPreviewOpen(visible),
                        afterOpenChange: (visible) => !visible && setPreviewImage(''),
                    }}
                    src={previewImage}
                />
            )}
        </Drawer>
    );
};

export default BookDetail;