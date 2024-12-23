import React from "react";
import { useNavigate } from "react-router-dom";
import "./index.css"; 
import Cookies from 'js-cookie'
import { Link } from "react-router-dom";

const Header = ({ onVideoUpload }) => {
  const navigate = useNavigate();

  // Handle Logout
  const handleLogout = () => {
    Cookies.remove('jwt_token')
    navigate("/login");
  };

  return (
    <header className="header-container">
      <div className="header-logo">
        <Link to='/' className="link-item"><h1>Video Manager</h1></Link>
      </div>
      <nav className="header-nav">
        <ul>
            <Link to='/upload' className="linkitems">
                <li>
                    Upload
                </li>
            </Link>
            <Link to='/videos' className="linkitems">
                <li>
                    Videos
                </li>
            </Link>
        </ul>
        <button onClick={handleLogout}>Logout</button>
      </nav>
    </header>
  );
};

export default Header;
