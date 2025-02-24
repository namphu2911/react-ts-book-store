
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

export {
    loginAPI, registerAPI, logoutAPI, fetchAccountAPI, getUsersAPI, createUserAPI, bulkCreateUserAPI, updateUserAPI
}