import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate, useParams  } from 'react-router-dom';
import '../../assets/css/teacher_css/UpdateSample.scss';
import { showSuccessNotification, showErrorNotification } from '../../App';

const UpdateSample = () => {
    const [sample, setSample] = useState({
        name: '',
        data_file: '',
    });

    const navigate = useNavigate();
    const { sampleId } = useParams();
    const token = Cookies.get('token');

    useEffect(() => {
        const fetchSample = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/manage-sample/${sampleId}/`, {
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                if (response.data) {
                    setSample(response.data);
                } else {
                    showErrorNotification('No sample data received');
                }
            } catch (error) {
                console.error('Failed to fetch sample:', error);
                showErrorNotification('Failed to fetch sample');
            }
        };

        fetchSample();
    }, [sampleId, token]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSample((prevSample) => ({
            ...prevSample,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        setSample((prevSample) => ({
            ...prevSample,
            data_file: e.target.files[0],
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', sample.name);
        formData.append('data_file', sample.data_file);
    
        const fileType = sample.data_file.name.split('.').pop();
    
        if(sample.data_file && (fileType !== 'mp4' && fileType !== 'csv' && fileType !== 'json')) {
            showErrorNotification(`Invalid file type for the chosen dataset. Please Upload the correct file type.`);
            return;
        }
        
        try {
            await axios.put(`http://127.0.0.1:8000/api/update-sample/${sampleId}/`, formData, { 
                headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
                },
            });

            showSuccessNotification('Sample updated successfully');
            } catch (error) {
                console.error('Failed to update sample:', error);
                showErrorNotification('Failed to update sample');
            }
        };

    const navigateBack = () => {
        const storedClassroomId = localStorage.getItem('currentClassroomId');
        console.log(storedClassroomId);
        navigate(`/manage-sample/${storedClassroomId}`);
    };


return (
    <div className="update-sample-container">
        <h2>Update Sample: {sample.name}</h2>
        <form onSubmit={handleSubmit}>
            <label htmlFor="name">Sample Name:</label>
            <input
                type="text"
                id="name"
                name="name"
                value={sample.name}
                onChange={handleInputChange}
            />

            <label htmlFor="data_file">Data File:</label>
            <input
                type="file"
                id="data_file"
                name="data_file"
                onChange={handleFileChange}
            />
            <button type ="submit" className="update-button">Update Sample</button>
            <button type="button" className="back-button" onClick={navigateBack}>Back</button>
        </form>
    </div>
);
};

export default UpdateSample;