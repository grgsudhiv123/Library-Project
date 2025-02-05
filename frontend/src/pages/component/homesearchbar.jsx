import { Search, User, Edit, LogOut  } from 'lucide-react';

import { useState, useEffect } from 'react';
import './searchbar.css';
import bookLogo from "../../logo/book-svgrepo-com.svg";

// import { User_Auth } from '../../endpoints/api.jsx';

import { LogoutUser, User_Data } from '../../endpoints/api.jsx';
import { useNavigate } from 'react-router-dom';


const HomeNavbar = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const nav = useNavigate();
    const [username, setUsername] = useState('')

    useEffect(()=> {
        const fetchdata = async ()=> {
            const res = await User_Data();
            if (res) {
                setUsername(res.username);
            }
        }
        fetchdata();
    }, [])
    const handleLogout = async ()=> {
        const success = await LogoutUser();
        if (success) {
            nav('/login')
        }
        alert("logout successful.");
    };


    return (
        <div className="search-navbar">
            {/* Logo */}
            <div className="search-navbar-logo">
                    <img src={bookLogo} alt="Book Logo" width="100" height="100" />
                <span className="font-bold text-xl">LIBRARY ZONE</span>
            </div>

            {/* Search Bar */}
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Search books..."
                    className="search-bar"
                />
                <button>
                    <Search className="w-4 h-4 text-gray-500" />
                </button>
            </div>

            {/* User Info */}
            <div className="user-info">
                <span>Welcome, {username}</span>
                <User
                    className="w-6 h-6 text-gray-600 cursor-pointer"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                />
                {dropdownOpen && (
                    <div className="dropdown-menu">           
                            <div className="drop-btn" >
                                <Edit className="w-3 h-3 text-gray-500" />                                
                                Change Password
                            </div>
                            <div className="drop-btn" onClick={handleLogout}>
                                <LogOut className="w-1 h-1 text-gray-500" />
                                Logout
                            </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HomeNavbar;
