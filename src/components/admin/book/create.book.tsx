import { createBookAPI, getCategoryAPI, uploadFileAPI } from "services/api";
import { App, Col, Form, FormProps, GetProp, Image, Input, InputNumber, Modal, Row, Select, Upload, UploadFile, UploadProps } from "antd";
import { useEffect, useState } from "react";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { UploadChangeParam } from "antd/es/upload";
import { MAX_UPLOAD_IMAGE_SIZE } from "@/services/helper";
import { UploadRequestOption as RcCustomRequestOptions } from 'rc-upload/lib/interface';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

type UserUploadType = "thumbnail" | "slider";

interface IProps {
    openModalCreate: boolean;
    setOpenModalCreate: (value: boolean) => void;
    refreshTable: () => void;
}

interface FieldType {
    mainText: string;
    author: string;
    price: number;
    category: string;
    quantity: number;
    thumbnail: string;
    slider: string[];
}

interface UploadedFile {
    uid: string;
    name: string;
    status: "done";
    url: string;
}

const CreateBook = (props: IProps) => {
    const { openModalCreate, setOpenModalCreate, refreshTable } = props;
    const [listCategory, setListCategory] = useState<{
        label: string;
        value: string;
    }[]>([]);
    const [isSubmit, setIsSubmit] = useState<boolean>(false);
    const [loadingThumbnail, setLoadingThumbnail] = useState<boolean>(false);
    const [loadingSlider, setLoadingSlider] = useState<boolean>(false);
    const [previewOpen, setPreviewOpen] = useState<boolean>(false);
    const [previewImage, setPreviewImage] = useState<string>('');

    const [fileListThumbnail, setFileListThumbnail] = useState<UploadFile[]>([]);
    const [fileListSlider, setFileListSlider] = useState<UploadFile[]>([]);


    const [form] = Form.useForm();
    const { message, notification } = App.useApp();

    useEffect(() => {
        const fetchCategory = async () => {
            const res = await getCategoryAPI();
            if (res && res.data) {
                const d = res.data.map((item) => {
                    return {
                        value: item,
                        label: item
                    }
                });
                setListCategory(d);
            }
        }
        fetchCategory();
    }, []);

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setIsSubmit(true);
        const { mainText, author, price, quantity, category } = values;
        const thumbnail = fileListThumbnail?.[0].name ?? "";
        const slider = fileListSlider?.map(item => item.name) ?? [];
        const res = await createBookAPI(mainText, author, price, quantity, category, thumbnail, slider);
        if (res && res.data) {
            message.success("Thêm mới book thành công");
            form.resetFields();
            setFileListThumbnail([]);
            setFileListSlider([]);
            setOpenModalCreate(false);
            refreshTable();
        } else {
            notification.error({
                message: "Thêm mới book thất bại",
                description: res.message
            })
        }
        setIsSubmit(false);
    }

    const onClose = () => {
        setFileListSlider([]);
        setFileListThumbnail([]);
        setOpenModalCreate(false);
        form.resetFields();
    }

    const getBase64 = (file: FileType): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });
    };

    const beforeUpload = (file: FileType) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < MAX_UPLOAD_IMAGE_SIZE;
        if (!isLt2M) {
            message.error(`Image must smaller than ${MAX_UPLOAD_IMAGE_SIZE}MB!`);
        }
        return isJpgOrPng && isLt2M || Upload.LIST_IGNORE;
    };

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }
        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    };

    const handleRemove = async (file: UploadFile, type: UserUploadType) => {
        if (type === 'thumbnail') {
            setFileListThumbnail([])
        }
        if (type === 'slider') {
            const newSlider = fileListSlider.filter(x => x.uid !== file.uid);
            setFileListSlider(newSlider);
        }
    };

    const handleChange = (info: UploadChangeParam, type: UserUploadType) => {
        if (info.file.status === 'uploading') {
            if (type === "slider") {
                setLoadingSlider(true);
            } else {
                setLoadingThumbnail(true);
            }
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            if (type === "slider") {
                setLoadingSlider(false);
            } else {
                setLoadingThumbnail(false);
            }
        }
    };

    const handleUploadFile = async (options: RcCustomRequestOptions, type: UserUploadType) => {
        const { onSuccess } = options;
        const file = options.file as UploadFile;
        const res = await uploadFileAPI(file, "book");
        if (res && res.data) {
            const uploadedFile: UploadedFile = {
                uid: file.uid,
                name: res.data.fileUploaded,
                status: "done",
                url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${res.data.fileUploaded}`
            }
            if (type === "thumbnail") {
                setFileListThumbnail([{ ...uploadedFile }]);
            } else {
                setFileListSlider((prevState) => [...prevState, { ...uploadedFile }]);
            }
            if (onSuccess) {
                onSuccess("ok");
            } else {
                message.error(res.message);
            }
        }
    };

    const normFile = (event: UploadChangeParam<UploadFile>): UploadFile[] | undefined => {
        if (Array.isArray(event)) {
            return event;
        }
        return event.fileList;
    };

    return (
        <Modal
            title="Thêm mới book"
            open={openModalCreate}
            onOk={() => form.submit()}
            onCancel={onClose}
            okText={"Thêm mới"}
            cancelText={"Hủy"}
            confirmLoading={isSubmit}
        >
            <Form
                form={form}
                name="form-create-book"
                onFinish={onFinish}
                autoComplete="off"
            >
                <Row gutter={[15, 15]}>
                    <Col span={12}>
                        <Form.Item<FieldType>
                            labelCol={{ span: 24 }}
                            label="Tên sách"
                            name="mainText"
                            rules={[{ required: true, message: 'Vui lòng nhập tên sách!' }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item<FieldType>
                            labelCol={{ span: 24 }}
                            label="Tác Giả"
                            name="author"
                            rules={[{ required: true, message: 'Vui lòng nhập tên tác giả!' }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={[15, 15]}>
                    <Col span={8}>
                        <Form.Item<FieldType>
                            labelCol={{ span: 24 }}
                            label="Giá Tiền"
                            name="price"
                            rules={[{ required: true, message: 'Vui lòng nhập giá tiền!' }]}
                        >
                            <InputNumber
                                min={1}
                                style={{ width: '100%' }}
                                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                addonAfter=" đ"
                            />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item<FieldType>
                            labelCol={{ span: 24 }}
                            label="Thể Loại"
                            name="category"
                            rules={[{ required: true, message: 'Vui lòng chọn thể loại sách!' }]}
                        >
                            <Select
                                showSearch
                                allowClear
                                options={listCategory}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item<FieldType>
                            labelCol={{ span: 24 }}
                            label="Số Lượng"
                            name="quantity"
                            rules={[{ required: true, message: 'Vui lòng nhập tên tác giả!' }]}
                        >
                            <InputNumber
                                min={1}
                                style={{ width: '100%' }}
                                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                addonAfter=" quyển"
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={[15, 15]}>
                    <Col span={12}>
                        <Form.Item<FieldType>
                            labelCol={{ span: 24 }}
                            label="Ảnh Thumbnail"
                            name="thumbnail"
                            rules={[{ required: true, message: 'Vui lòng upload thumbnail!' }]}
                            //convert value from Upload => form
                            valuePropName="fileList"
                            getValueFromEvent={normFile}
                        >
                            <Upload
                                listType="picture-card"
                                className="avatar-uploader"
                                maxCount={1}
                                multiple={false}
                                customRequest={(options) => handleUploadFile(options, 'thumbnail')}
                                beforeUpload={beforeUpload}
                                onChange={(info) => handleChange(info, 'thumbnail')}
                                onPreview={handlePreview}
                                onRemove={(file) => handleRemove(file, 'thumbnail')}
                                fileList={fileListThumbnail}
                            >
                                <div>
                                    {loadingThumbnail ? <LoadingOutlined /> : <PlusOutlined />}
                                    <div style={{ marginTop: 8 }}>Upload</div>
                                </div>
                            </Upload>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item<FieldType>
                            labelCol={{ span: 24 }}
                            label="Ảnh Slider"
                            name="slider"
                            rules={[{ required: true, message: 'Vui lòng upload slider!' }]}
                            //convert value from Upload => form
                            valuePropName="fileList"
                            getValueFromEvent={normFile}
                        >
                            <Upload
                                multiple
                                listType="picture-card"
                                className="avatar-uploader"
                                customRequest={(options) => handleUploadFile(options, 'slider')}
                                beforeUpload={beforeUpload}
                                onChange={(info) => handleChange(info, 'slider')}
                                onPreview={handlePreview}
                                onRemove={(file) => handleRemove(file, 'slider')}
                                fileList={fileListSlider}
                            >
                                <div>
                                    {loadingSlider ? <LoadingOutlined /> : <PlusOutlined />}
                                    <div style={{ marginTop: 8 }}>Upload</div>
                                </div>
                            </Upload>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
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
        </Modal>
    )
}
export default CreateBook;