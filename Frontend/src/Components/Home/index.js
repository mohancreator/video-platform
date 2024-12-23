import Cookies from 'js-cookie';
import { Component } from 'react';
import { Navigate } from 'react-router-dom';
import Header from '../Header';
import './index.css';

class Home extends Component {
    state = { 
        islogedOut: false,
        redirectToUpload: false // New state to trigger the redirection
    };

    logout = () => {
        Cookies.remove('jwt_token');
        this.setState({ islogedOut: true });
    };

    upload = () => {
        // Set the state to trigger redirection
        this.setState({ redirectToUpload: true });
    }

    render() {
        const { islogedOut, redirectToUpload } = this.state;
        if (islogedOut) {
            return <Navigate to='/login' />;
        }

        if (redirectToUpload) {
            // Redirect to the upload page
            return <Navigate to='/upload' />;
        }

        return (
            <div className="home-container">
                <Header />
                <div className="home-content">
                    <img
                        src="https://img.freepik.com/free-vector/modern-welcome-lettering-your-event_1017-50033.jpg?t=st=1734932248~exp=1734935848~hmac=e0a3ac16827e61f8d86b32345bc94f59ce850091e9b5265158140c3e5c34d6b8&w=900"
                        alt="Video Icon"
                        className="video-icon"
                    />
                    <h1>Welcome to the Video Manager App</h1>
                    <p>Manage, upload, and organize your videos with ease.</p>
                    <button className='upload-button' onClick={this.upload}>UPLOAD HERE</button>
                </div>
            </div>
        );
    }
}

export default Home;
