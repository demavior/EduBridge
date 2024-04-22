import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate, useParams  } from 'react-router-dom';
import '../../assets/css/teacher_css/UpdateClassroom.scss';
import { showSuccessNotification, showErrorNotification } from '../../App';

const UpdateClassroom = () => {
  const [classroom, setClassroom] = useState({
    name: '',
    description: '',
    definitions_choice: '',
    definitions_upload: null, 
  });

  const navigate = useNavigate();
  const { classroomId } = useParams();
  const token = Cookies.get('token');

  useEffect(() => {
    const fetchClassroom = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/manage-classroom/${classroomId}/`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (response.data) {
                setClassroom(response.data);
            } else {
                showErrorNotification('No classroom data received');
            }
        } catch (error) {
            console.error('Failed to fetch classroom:', error);
            showErrorNotification('Failed to fetch classroom');
        }
    };
    
    fetchClassroom();
  }, [classroomId, token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setClassroom((prevClassroom) => ({
      ...prevClassroom,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setClassroom((prevClassroom) => ({
      ...prevClassroom,
      definitions_upload: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', classroom.name);
    formData.append('description', classroom.description);
    formData.append('definitions_choice', classroom.definitions_choice);

    if (classroom.definitions_choice === 'UP' && classroom.definitions_upload) {
      formData.append('definitions_upload', classroom.definitions_upload);
    }

    try {
      await axios.put(`http://127.0.0.1:8000/api/update-classroom/${classroomId}/`, formData, { 
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      showSuccessNotification('Classroom updated successfully');
      navigate('/manage-classroom');
    } catch (error) {
      console.error('Failed to update classroom:', error);
      showErrorNotification('Failed to update classroom');
    }
  };

  return (
    <div className="update-classroom-container">
      <h2>Update Classroom: {classroom.name}</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Classroom Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={classroom.name}
          onChange={handleInputChange}
        />

        <label htmlFor="description">Classroom Description:</label>
        <textarea
          id="description"
          name="description"
          value={classroom.description}
          onChange={handleInputChange}
        />

        <label htmlFor="definitions_choice">Upload Definitions:</label>
        <select
          id="definitions_choice"
          name="definitions_choice"
          value={classroom.definitions_choice}
          onChange={handleInputChange}
        >
          <option value="NO">No</option>
          <option value="UP">Yes - Upload a File</option>
        </select>

        {classroom.definitions_choice === 'UP' && (
          <input
            type="file"
            name="definitions_upload"
            onChange={handleFileChange}
          />
        )}

        <p>Dataset: {classroom.data}</p>

        <button type="submit" className="update-button">Update Classroom</button>
        <button type="button" className="back-button" onClick={() => navigate('/manage-classroom')}>Back</button>
      </form>
    </div>
  );
};

export default UpdateClassroom;