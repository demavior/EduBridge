import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate  } from 'react-router-dom';
import Cookies from 'js-cookie';
import ClassroomSearch from './ManageClassroomSearch';
import ClassroomNote from './ManageClassroomNote';
import '../../assets/css/teacher_css/ManageClassroom.scss';
import { showSuccessNotification, showErrorNotification } from '../../App';


const ManageClassroom = () => {
  const [classrooms, setClassrooms] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredClassrooms, setFilteredClassrooms] = useState([]);
  const [showNote, setShowNote] = useState(true);
  const token = Cookies.get('token');
  const navigate = useNavigate();

  useEffect(() => {
    fetchClassrooms();
  }, []);

  const fetchClassrooms = async () => {
    try {
        const response = await axios.get('http://127.0.0.1:8000/api/list-classrooms/', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        setClassrooms(response.data);
        setFilteredClassrooms(response.data);

      } catch (error) {
        console.log('Failed to fetch classrooms:', error);
        showErrorNotification('Failed to fetch classrooms');
      }
    };
    const handleSearch = () => {
      const filtered = classrooms.filter(classroom => 
        classroom.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredClassrooms(filtered);
    };

    const handleDelete = async (id) => {
      const isConfirmed = window.confirm("Are you sure you want to delete this classroom?");
      if (isConfirmed) {
        try {
          await axios.delete(`http://127.0.0.1:8000/api/delete-classroom/${id}/`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          fetchClassrooms(); 
          showSuccessNotification('Classroom deleted successfully');
        } catch (error) {
          console.error("Failed to delete classroom:", error);
          showErrorNotification("Failed to delete classroom");
        }
      }
    };

    const handleViewSamples = (id) => {
      navigate(`/manage-sample/${id}`); 
    };

  return (
    <div className="manageClassroom-container">
      <h1>Manage Classroom</h1>
      {showNote && <ClassroomNote onDismiss={() => setShowNote(false)} />} 
      <ClassroomSearch searchTerm={searchTerm} onSearchChange={setSearchTerm} onSearchSubmit={handleSearch} />
      <br>
      </br>
      {classrooms.length > 0 ? (
      <div className="manageClassroom-content">
      <table>
        <thead>
          <tr>
            <th>Update Classroom
            <span className="tooltip">
              <span className="tooltiptext">Click to update classroom</span>
            </span>
            </th>
            <th>Classroom Created Date
            <span className="tooltip">
              <span className="tooltiptext">Date when classroom was created</span>
            </span>
            </th>
            <th>Create Question for Classroom
            <span className="tooltip">
              <span className="tooltiptext">Click to create questions for classroom</span>
            </span>
            </th>
            <th>Update Questions
            <span className="tooltip">
              <span className="tooltiptext">Click to update questions</span>
            </span>
            </th>
            <th>View Samples
            <span className="tooltip">
              <span className="tooltiptext">Click to view samples</span>
            </span>
            </th>
            <th>Delete Classroom
            <span className="tooltip">
              <span className="tooltiptext">Click to delete classroom</span>
            </span>
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredClassrooms.map((classroom) => (
            <tr key={classroom.id}>
              <td><Link to={`/update-classroom/${classroom.id}`}>{classroom.name}</Link></td>
              <td>{new Date(classroom.date_of_creation).toLocaleDateString()}</td>
              <td><Link to={`/create-question/${classroom.id}`}>{classroom.name}</Link></td>
              <td><Link to={`/update-question/${classroom.id}`}>{classroom.name}</Link></td>
              <td>
                <button className="view-samples-btn" onClick={() => handleViewSamples(classroom.id)}>
                  View Samples
                </button>
              </td>
              <td>
                <button className="delete-btn" onClick={() => handleDelete(classroom.id)}>
                  DELETE
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      ) : (
        <div className="no-classrooms">
          <p>There are no classrooms created to manage.</p>
        </div>
      )}
      <br>
      </br>
      <button type="button" className="back-btn" onClick={() => navigate('/create-classroom')}>Create Classroom</button>
    </div>
  );
};

export default ManageClassroom;
