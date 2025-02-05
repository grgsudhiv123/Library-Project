
import { useState } from 'react';
import Navbar from "../component/navbar.jsx";
import "./home.css";
import HomeNavbar from "../component/homesearchbar.jsx";

// Change-contents component
import BookList from "../contentpages/books.jsx";
import UserBookList from "../contentpages/userbooklist.jsx";
import UserProfile from "../contentpages/userprofile.jsx";
import UserHistory from "../contentpages/history.jsx";
import Settings from "../contentpages/settings.jsx";

const Home = () => {

    const [activeItem, setActiveItem] = useState('')

    const renderContent = () => {
        switch (activeItem) {
            case "Books":
                return <BookList/>;
            case "Reading List":
                return <UserBookList/>;
            case "History":
                return <UserHistory/>;
            case "Profile":
                return <UserProfile/>;   
            case "Settings":
                return <Settings/>;    
            default:
                return <BookList/>;
        }
    }


    return (
        <>
        <div className="home-container">
            <Navbar props={setActiveItem}/>
            <div className="content-container">
                <HomeNavbar/>
                {renderContent()}
            </div>
        </div>
        </>
    )
}

export default Home;