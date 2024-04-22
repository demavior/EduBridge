import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import '../../assets/css/teacher_css/CreateClassroom.scss';
import UploadVideoDatasetTable from './UploadVideoDatasetTable';
import TextDataSetTable from './TextDataSetTable';
import { showSuccessNotification, showErrorNotification } from '../../App';

const CreateClassroom = () => {
    const token = Cookies.get('token');
    const navigate = useNavigate();
    const [classroomName, setClassroomName] = useState('');
    const [classroomDescription, setClassroomDescription] = useState('');
    const [uploadDefinition, setUploadDefinition] = useState('NO');
    const [dataSet, setDataSet] = useState('');
    const [file, setFile] = useState(null);

    const handleCreateSample = async (e) => {
        e.preventDefault();

        if (!classroomName.trim() || !dataSet) {
            showErrorNotification('Please provide a classroom name and choose a dataset.');
            return;
        }

        if (uploadDefinition === 'UP' && file) {
            const allowedExtensions = /(\.pdf|\.docx)$/i;
            if (!allowedExtensions.exec(file.name)) {
                showErrorNotification('Please upload a PDF or DOCX file only for the definitions.');
                return;
            }
        }

        const formData = new FormData();
        formData.append('name', classroomName);
        if (classroomDescription.trim()) formData.append('description', classroomDescription);
        formData.append('definitions_choice', uploadDefinition);
        formData.append('data', dataSet);
        if (uploadDefinition === 'UP' && file) {
            formData.append('definitions_upload', file);
        }

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/create-classroom/', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            console.log(response.data);
            showSuccessNotification('Classroom Created Successfully');
            navigate('/create-sample', { state: { dataSet: dataSet, classroomId: response.data.id } });
            Cookies.set('classroomId', response.data.id);
        } catch (error) {
            if (error.response && error.response.data) {
                let errorMessage = '';
                const errorData = error.response.data;
                for (const key in errorData) {
                    if (errorData.hasOwnProperty(key)) {
                        errorMessage += `${key}: ${errorData[key].join(' ')} `;
                    }
                }
                showErrorNotification(errorMessage.trim());
            } else {
                showErrorNotification('An unexpected error occurred. Please try again later.');
            }
        }
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    let tableComponent = null;

    if (dataSet === 'VDUP') {
        tableComponent = <UploadVideoDatasetTable />;
    } else if (dataSet === 'TX') {
        tableComponent = <TextDataSetTable />;
    }

    return (
        <div className="createClassroom-container">
            <h1>Create Classroom</h1>
            <div className="createClassroom-content">
                <div className="form-group">
                    <h3>Classroom Name:*
                        <span className="tooltip">
                            <span className="tooltip-text">The classroom name should be unique.</span>
                        </span>
                    </h3>
                    <input type="text" name="classroomName" value={classroomName} onChange={(e) => setClassroomName(e.target.value)} required />
                </div>
                <div className="form-group">
                    <h3>
                        Classroom Description:
                        <span className="tooltip">
                            <span className="tooltip-text">Provide a brief description of the classroom.</span>
                        </span>
                    </h3>
                    <input type="text" name="classroomDescription" value={classroomDescription} onChange={(e) => setClassroomDescription(e.target.value)} />
                </div>
                <div className="form-group radio-group">
                    <h3>
                        Upload a Definition:
                        <span className="tooltip">
                            <span className="tooltip-text">Choose whether to upload a file for definitions or not.</span>
                        </span>
                    </h3>
                    <div className="radio-label">
                        <input
                            type="radio"
                            name="definitions_choice"
                            value="NO"
                            checked={uploadDefinition === 'NO'}
                            onChange={(e) => setUploadDefinition(e.target.value)}
                        /> No
                    </div>
                    <div className="radio-label">
                        <input
                            type="radio"
                            name="definitions_choice"
                            value="UP"
                            checked={uploadDefinition === 'UP'}
                            onChange={(e) => setUploadDefinition(e.target.value)}
                        /> Upload a File
                    </div>
                </div>
                {uploadDefinition === 'UP' && (
                    <div className="form-group">
                        <label>
                            Definitions File:
                            <span className="tooltip">
                                <span className="tooltip-text">Upload a PDF file containing definitions.</span>
                            </span>
                        </label>
                        <input type="file" onChange={handleFileChange} />
                    </div>
                )}
                <div className="form-group radio-group">
                    <h3>
                        Data Set:*
                        <span className="tooltip">
                            <span className="tooltip-text">Choose the type of data set for the classroom.</span>
                        </span>
                    </h3>
                    {/*
                    <label>
                        <input type="radio" name="dataSet" value="VDUP" checked={dataSet === 'VDUP'} onChange={(e) => setDataSet(e.target.value)} />
                        Video Upload
            </label>*/}
                    <label>
                        <input type="radio" name="dataSet" value="TX" checked={dataSet === 'TX'} onChange={(e) => setDataSet(e.target.value)} />
                        Text DataSet
                    </label>
                </div>
                {tableComponent}
                <button className="submit-button" onClick={handleCreateSample}>Create Classroom</button>
            </div>
        </div>
    );
};

export default CreateClassroom;