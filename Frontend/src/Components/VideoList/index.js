import './index.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../Header';
import { TailSpin } from 'react-loader-spinner';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom'; // Import the useNavigate hook

const VideoList = () => {
    const [videos, setVideos] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useState({
        title: '',
        tag: '',
        date: ''
    });
    const [isLoggedOut, setIsLoggedOut] = useState(false); // State for logout
    const [redirectToUpload, setRedirectToUpload] = useState(false); // State to trigger redirection

    const navigate = useNavigate(); // Hook to manage redirection

    useEffect(() => {
        const fetchVideos = async () => {
            const token = Cookies.get('jwt_token');
            if (!token) {
                alert('User not authenticated');
                return;
            }
            try {
                const decodedToken = jwtDecode(token);
                const userId = decodedToken.id;
                setLoading(true);

                const { title, tag, date } = searchParams;
                const response = await axios.get(
                    `http://localhost:8001/videos?userId=${userId}&page=${page}&title=${title}&tag=${tag}&date=${date}`,
                    { withCredentials: true }
                );
                setVideos(response.data.videos);
            } catch (error) {
                console.error('Error fetching videos:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchVideos();
    }, [page, searchParams]);

    const handleSearchChange = (e) => {
        const { name, value } = e.target;
        setSearchParams(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleUploadRedirect = () => {
        setRedirectToUpload(true);
        navigate('/upload'); // Redirects the user to the upload page
    };

    return (
        <div>
            <Header />
            <div className='videos-container'>
                {/* Search Section */}
                <div className="search-container">
                    <input
                        type="text"
                        name="title"
                        value={searchParams.title}
                        onChange={handleSearchChange}
                        placeholder="Search by title"
                    />
                    <input
                        type="text"
                        name="tag"
                        value={searchParams.tag}
                        onChange={handleSearchChange}
                        placeholder="Search by tag"
                    />
                    <input
                        type="date"
                        name="date"
                        value={searchParams.date}
                        onChange={handleSearchChange}
                    />
                    <button onClick={() => setPage(1)}>Search</button>
                </div>

                {loading ? (
                    <div className="loader-container">
                        <TailSpin color="#007BFF" height={50} width={50} />
                    </div>
                ) : (
                    videos.length === 0 ? (
                        <div className='nothing-container'>
                            <h1 className='nothing'>Nothing to show here</h1>
                            <button className='upload-button' onClick={handleUploadRedirect}>PLEASE UPLOAD</button>
                        </div>
                    ) : (
                        <div>
                            <ul className="video-list">
                                {videos.map((video) => (
                                    <li key={video._id} className="video-item">
                                        <h3>{video.title}</h3>
                                        <p>{video.description}</p>
                                        <p>{video.tags}</p>
                                        <a href={video.googleDriveLink} target="_blank" rel="noreferrer">
                                            Watch Video
                                        </a>
                                    </li>
                                ))}
                            </ul>
                            <div className="pagination-buttons">
                                <button disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</button>
                                <button onClick={() => setPage(page + 1)}>Next</button>
                            </div>
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default VideoList;
