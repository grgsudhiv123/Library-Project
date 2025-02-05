import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000/library/";
const LOGIN_URL = `${BASE_URL}login/`;
const AUTH_URL = `${BASE_URL}is-authenticated/`;
const LOGOUT_URL = `${BASE_URL}logout/`;
const REGISTER_URL = `${BASE_URL}register/`;
const BOOKS_URL = `${BASE_URL}bookapi/`;
const BORROW_URL = `${BASE_URL}borrow-book/`;
const RETURN_BORROW_URL = `${BASE_URL}return-borrow-book/`;
const BORROW_RECORD_URL = `${BASE_URL}user-borrow-record/`;




export const LoginUser = async (username, password) => {
    try {
        const response = await axios.post(LOGIN_URL, 
            { username, password },
            { withCredentials: true }
        );

        if (response.status === 200 && response.data.success) {
            return true;
        }
    } catch (error) {
        if (error.response && error.response.status === 401) {
            console.error("Invalid credentials");
        } else {
            console.error("Login error:", error);
        }
        return false;
    }
};


export const Register_User = async (username, email, password) => {
    try {
        const response = await axios.post(REGISTER_URL, {
            username: username,
            email: email,
            password: password
        }, { withCredentials: true });

        return response.data; 
    } catch (error) {
        console.error("Error during registration:", error.response ? error.response.data : error.message);
        throw error;
    }
}



export const User_Auth = async () => {
    try {
        const response = await axios.post(AUTH_URL, 
            {},
            { withCredentials: true }
        );
        return response.data.authenticated
    } catch (error) {
        alert(error)
        return false
    }
}



export const User_Data = async () => {
    try {
        const response = await axios.post(AUTH_URL, 
            {},
            { withCredentials: true }
        );
        return response.data.userdata
    } catch (error) {
        alert(error)
        return false
    }
}

export const LogoutUser = async () => {
    try{
        await axios.post(LOGOUT_URL,{},{withCredentials: true})
        return true
    } catch (error) {
        return error
    }
}

export const GetBooks = async () => {
    try{
        const response = await axios.get(BOOKS_URL,
            {withCredentials : true,});
        return response.data.bookdata;
    } catch (error){
        console.log(error)
    }
}



export const BorrowBook = async (bookId) => {
    try {
        const response = await axios.post(
            BORROW_URL,
            { book: bookId }, 
            { withCredentials: true }
        );

        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        console.error("BorrowBook error:", error);
    }
    return null;
};



export const ReturnBorrowBook = async (bookId) => {
        try{
            const res = await axios.post(RETURN_BORROW_URL,
                {book : bookId},
                { withCredentials: true });
            return res.data.message;
        } catch (error){
            alert(error)
        }
}



export const UserBorrowRecord = async () => {
        try{
            const res = await axios.get(BORROW_RECORD_URL,
                    { withCredentials: true });
            return res.data.borrowData;
        } catch (error){
            console.log(error)
        }
}