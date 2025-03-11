export { };

declare global {
    interface IBackendRes<T> {
        error?: string | string[];
        message: string;
        statusCode: number | string;
        data?: T;
    }

    interface IModelPaginate<T> {
        meta: {
            current: number;
            pageSize: number;
            pages: number;
            total: number;
        },
        result: T[]
    }

    interface ILogin {
        access_token: string;
        user: {
            id: string;
            fullName: string;
            email: string;
            phone: string;
            role: string;
            avatar: string;
        }
    }

    interface IRegister {
        _id: string;
        email: string;
        fullName: string;
    }

    interface IUser {
        id: string;
        fullName: string;
        email: string;
        phone: string;
        role: string;
        avatar: string;
    }

    interface IFetchAccount {
        user: IUser;
    }

    interface IUserTable {
        _id: string,
        fullName: string,
        email: string,
        phone: number,
        role: string,
        avatar: string,
        isActive: boolean,
        createdAt: Date,
        updatedAt: Date,
    }

    interface IResponseImport {
        countSuccess: 3,
        countError: 0,
        detail: any
    }

    interface IBookTable {
        _id: string;
        thumbnail: string;
        slider: string[];
        mainText: string;
        author: string;
        price: number;
        sold: number;
        quantity: number;
        category: string;
        createdAt: Date;
        updatedAt: Date;
    }

    interface ICart {
        _id: string;
        quantity: number;
        detail: IBookTable;
    }

    interface IOrder {
        name: string;
        address: string;
        phone: number;
        totalPrice: number;
        type: string;
        detail: [];
    }

    interface IHistory {
        _id: string;
        name: string;
        type: string;
        email: string;
        phone: number;
        userID: string;
        detail: {
            bookName: string;
            quantity: number;
            _id: string;
        }[];
        totalPrice: number;
        createdAt: Date;
        updatedAt: Date;
    }
}