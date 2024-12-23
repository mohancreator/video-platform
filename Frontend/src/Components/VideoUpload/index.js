import './index.css';
import React, { useState } from 'react';
import axios from 'axios';
import Header from '../Header';
import Cookies from 'js-cookie'
import { jwtDecode } from 'jwt-decode';

const VideoUpload = () => {
    const initialFormState = {
        title: '',
        description: '',
        tags: '',
        googleDriveLink: '',
        fileSize: '',
    };

    const [formData, setFormData] = useState(initialFormState);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = Cookies.get('jwt_token');
        if (!token) {
            alert('User not authenticated');
            return;
        }

        try {
            const decodedToken = jwtDecode(token);
            const userId = decodedToken.id;
            console.log(userId);

            const response = await axios.post(
                'http://localhost:8001/upload',
                { ...formData, userId },
                {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            alert('Video uploaded successfully!');
            setFormData(initialFormState); 
        } catch (error) {
            console.error('Error uploading video:', error);
        }
    };

    return (
        <div className='upload-container'>
            <Header />
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="title"
                    placeholder="Video Title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                />
                <textarea
                    name="description"
                    placeholder="Video Description"
                    value={formData.description}
                    onChange={handleChange}
                />
                <input
                    type="text"
                    name="tags"
                    placeholder="Tags (comma-separated)"
                    value={formData.tags}
                    onChange={handleChange}
                />
                <input
                    type="text"
                    name="googleDriveLink"
                    placeholder="Google Drive Link"
                    value={formData.googleDriveLink}
                    onChange={handleChange}
                    required
                />
                <input
                    type="number"
                    name="fileSize"
                    placeholder="File Size (MB)"
                    value={formData.fileSize}
                    onChange={handleChange}
                />
                <button className='up-but' type="submit">Upload</button>
            </form>
        </div>
    );
};

export default VideoUpload;
