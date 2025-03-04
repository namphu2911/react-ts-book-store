
import axios from "services/axios.customize";

const loginAPI = (username: string, password: string) => {
    const urlBackend = "/api/v1/auth/login";
    const data = { username, password }
    return axios.post<IBackendRes<ILogin>>(urlBackend, data, {
        headers: {
            delay: 2000
        }
    });
}

const registerAPI = (fullName: string, email: string, password: string, phone: number) => {
    const urlBackend = "/api/v1/user/register";
    const data = { fullName, email, password, phone }
    return axios.post<IBackendRes<IRegister>>(urlBackend, data);
}

const logoutAPI = () => {
    const urlBackend = "/api/v1/auth/logout";
    return axios.post<IBackendRes<ILogin>>(urlBackend);
}

const fetchAccountAPI = () => {
    const urlBackend = "/api/v1/auth/account";
    return axios.get<IBackendRes<IFetchAccount>>(urlBackend, {
        headers: {
            delay: 3000
        }
    });
}

const getUsersAPI = (query: string) => {
    const urlBackend = `/api/v1/user?${query}`;
    return axios.get<IBackendRes<IModelPaginate<IUserTable>>>(urlBackend);
}

const createUserAPI = (fullName: string, email: string, password: string, phone: number) => {
    const urlBackend = "/api/v1/user";
    const data = { fullName, email, password, phone }
    return axios.post<IBackendRes<IRegister>>(urlBackend, data);
}

const bulkCreateUserAPI = (
    data: {
        fullName: string,
        email: string,
        password: string,
        phone: number,
    }[]) => {
    const urlBackend = "/api/v1/user/bulk-create";
    return axios.post<IBackendRes<IResponseImport>>(urlBackend, data);
}

const updateUserAPI = (_id: string, fullName: string, phone: number) => {
    const urlBackend = "/api/v1/user";
    const data = { _id, fullName, phone }
    return axios.put<IBackendRes<IRegister>>(urlBackend, data);
}

const deleteUserAPI = (_id: string) => {
    const urlBackend = `/api/v1/user/${_id}`;
    return axios.delete<IBackendRes<IRegister>>(urlBackend)
}

const getBooksAPI = (query: string) => {
    const urlBackend = `/api/v1/book?${query}`;
    return axios.get<IBackendRes<IModelPaginate<IBookTable>>>(urlBackend)
}

const getCategoryAPI = () => {
    const urlBackend = `/api/v1/database/category`;
    return axios.get<IBackendRes<string[]>>(urlBackend);
}

const uploadFileAPI = (fileImg: any, folder: string) => {
    const bodyFormData = new FormData();
    bodyFormData.append('fileImg', fileImg);
    return axios<IBackendRes<{
        fileUploaded: string
    }>>({
        method: 'post',
        url: '/api/v1/file/upload',
        data: bodyFormData,
        headers: {
            "Content-Type": "multipart/form-data",
            "upload-type": folder
        },
    });
}

const createBookAPI = (
    mainText: string, author: string,
    price: number, quantity: number,
    category: string, thumbnail: string, slider: string[]
) => {
    const data = { mainText, author, price, quantity, category, thumbnail, slider, sold: 22 }
    console.log(data);
    const urlBackend = "/api/v1/book";
    return axios.post<IBackendRes<IBookTable>>(urlBackend, data);
}

export {
    loginAPI, registerAPI, logoutAPI, fetchAccountAPI,
    getUsersAPI, createUserAPI, bulkCreateUserAPI, updateUserAPI, deleteUserAPI,
    getBooksAPI, getCategoryAPI, uploadFileAPI, createBookAPI
}