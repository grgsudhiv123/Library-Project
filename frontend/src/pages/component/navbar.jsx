import { useState } from 'react';
import { Menu, X, BookOpen, User, Clock, Library, Settings } from 'lucide-react';
import './navbar.css';

const Navbar = ({props}) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(null); // Track active index

    const navItems = [
        { icon: BookOpen, label: 'Books' },
        { icon: Library, label: 'Reading List' },
        { icon: Clock, label: 'History' },
        { icon: User, label: 'Profile' },
        { icon: Settings, label: 'Settings' }
    ];

    const handleItemClick = (index, label) => {
        setActiveIndex(index); // Highlight active item
        props(label); // Update content in Home.jsx
    };

    return (
        <div className={`navbar ${isMenuOpen ? 'w-48' : 'w-16'}`}>
            {/* Menu Toggle Button */}
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="menu-toggle-btn">
                {isMenuOpen ? <X className="icon" /> : <Menu className="icon" />}
            </button>

            {/* Navigation Items */}
            <nav className="nav-items">
                {navItems.map((item, index) => (
                    <button
                        key={index}
                        className={`nav-item-btn ${activeIndex === index ? 'active' : ''}`}
                        onClick={() => handleItemClick(index, item.label)}
                    >
                        <item.icon className="icon" />
                        {isMenuOpen && <span className="nav-item-label">{item.label}</span>}
                    </button>
                ))}
            </nav>
        </div>
    );
};

export default Navbar;
