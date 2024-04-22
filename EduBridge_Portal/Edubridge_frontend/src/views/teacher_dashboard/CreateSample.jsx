import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import '../../assets/css/teacher_css/CreateSample.scss';
import { showSuccessNotification, showErrorNotification } from '../../App';


const CreateSample = () => {
    const token = Cookies.get('token');
    const navigate = useNavigate();
    const location = useLocation();
    const [classroomId, setClassroomId] = useState('');
    const [sampleName, setSampleName] = useState('');
    const [file, setFile] = useState(null);
    const [datasetType, setDatasetType] = useState('');

    useEffect(() => {
        console.log("Received state:", location.state); 
        if (location.state && location.state.dataSet && location.state.classroomId) {
            setDatasetType(location.state.dataSet);
            setClassroomId(location.state.classroomId);
        } else {
            showErrorNotification('Missing classroom information. Please navigate from the classroom creation page.');
        }
    }, [location]);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleCreateSample = async (e) => {
        e.preventDefault();

        const allowedExtensions = datasetType === "VDUP" ? /\.zip$/i :
                                  (datasetType === "VDUR" || datasetType === "TX") ? /\.(csv|json)$/i : null;

        if (file && allowedExtensions && !allowedExtensions.test(file.name)) {
            showErrorNotification(`Invalid file type for the chosen dataset. Please Upload the correct file type.`);
            return;
        }
        
        console.log("Sample Name:", sampleName);
        console.log("File:", file);

        const formData = new FormData();
        formData.append('name', sampleName);
        formData.append('data_file', file);

        console.log("Form Data:", formData);

        try {
            await axios.post(`http://127.0.0.1:8000/api/create-sample/${classroomId}/`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            showSuccessNotification('Sample Created Successfully');
            navigate('/manage-classroom');
        } catch (error) {
            showErrorNotification('An error occurred while creating the sample. Please try again.');
        }
    };

    return (
        <div className="createSample-container">
            <h1>Create Sample</h1>
            <form className="createSample-content" onSubmit={handleCreateSample}>
                <div className="form-group">
                    <h3> Sample Name:*
                        <span className="tooltip">
                            <span className="tooltiptext">Enter the name of the sample.</span>
                        </span>
                    </h3>
                    <input 
                        type="text"
                        name="sampleName"
                        value={sampleName}
                        onChange={(e) => setSampleName(e.target.value)} 
                        required
                    />
                </div>
                <div className="form-group">
                    <h3>Upload Data File:*
                        <span className="tooltip">
                            <span className="tooltiptext">Upload the data file for your sample. Accepted formats depend on the dataset type.</span>
                        </span>
                    </h3>
                    <input 
                        type="file"
                        name="dataFile"
                        onChange={handleFileChange}
                        required
                    />
                </div>
                <button type="submit" className="submit-button">Create Sample</button>
            </form>
        </div>
    );
};

export default CreateSample;