import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {Link, useNavigate, useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import SampleSearch from './SampleSearch';
import '../../assets/css/teacher_css/ManageSample.scss';
import {showSuccessNotification, showErrorNotification} from '../../App';

const ManageSample = () => {
    const [samples, setSamples] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredSamples, setFilteredSamples] = useState([]);
    const token = Cookies.get('token');
    const navigate = useNavigate();
    const { classroomId } = useParams();

    useEffect(() => {
        fetchSamples();
    }, []);

    const fetchSamples = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/list-samples/${classroomId}/`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            setSamples(response.data);
            setFilteredSamples(response.data);
        } catch (error) {
            showErrorNotification('Failed to fetch samples');
        }
    };

    const handleDelete = async (id) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this sample?");
        if (isConfirmed) {
            try {
                await axios.delete(`http://127.0.0.1:8000/api/delete-sample/${id}/`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                console.log("id", id);
                fetchSamples();
                showSuccessNotification('Sample deleted successfully');
            } catch (error) {
                console.error("Failed to delete sample:", error);
                showErrorNotification("Failed to delete sample");
            }
        }
    };
    
    const handleViewSample = (event, id) => {
        event.preventDefault(); 
        localStorage.setItem('currentClassroomId', classroomId);
        navigate(`/update-sample/${id}`); 
    };
    

    const handleSearch = () => {
        const filtered = samples.filter(sample =>
            sample.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredSamples(filtered);
    };

    return (
        <div className="manageSample-container">
            <h1>Your Samples</h1>
            <SampleSearch searchTerm={searchTerm} onSearchChange={setSearchTerm} onSearchSubmit={handleSearch} />
            <br /><br />
            {filteredSamples.length > 0 ? (
                <div className="manageSample-content">
                    <table>
                        <thead>
                            <tr>
                                <th> Update Sample:
                                    <span className="tooltip">
                                        <span className="tooltiptext">Click to update sample</span>
                                    </span>
                                </th>
                                <th> View Token:
                                    <span className="tooltip">
                                        <span className="tooltiptext">Click to view token</span>
                                    </span>
                                </th>
                                <th> Delete Sample:
                                    <span className="tooltip">
                                        <span className="tooltiptext">Click to delete sample</span>
                                    </span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSamples.map((sample) => (
                                <tr key={sample.id}>
                                    <td onClick={(event) => handleViewSample(event, sample.id)}>
                                        <Link to={`/update-sample/${sample.id}`} onClick={(event) => event.stopPropagation()}>
                                            {sample.name}
                                        </Link>
                                    </td>
                                    <td>{sample.token}</td>
                                    <td><button className="delete-btn" onClick={() => handleDelete(sample.id)}>Delete</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="no-sample">
                    <p>No samples found.</p>
                </div>
            )}
            <br>
            </br>
            <button type="button" className="back-btn" onClick={() => navigate('/manage-classroom')}>Back</button>
        </div>
    );
};

export default ManageSample;