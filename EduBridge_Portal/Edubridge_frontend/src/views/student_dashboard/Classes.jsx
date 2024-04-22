import React,{useState, useEffect} from "react";
import Cookies from 'js-cookie';

const Classes = () => {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const logintoken = Cookies.get('token');
        const username = Cookies.get('username');
        console.log('Login Token:', logintoken);
        console.log('Username:', username);

        fetch('http://127.0.0.1:8000/api/list-classrooms'),{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "login_token": logintoken, "user": username})
            }
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const newData = JSON.parse(data);
            setClasses(newData);
            setLoading(false);
        })
        .catch(error => {
            console.error('Error fetching classes:', error);
            setError(error);
            setLoading(false);
        });
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }
    if (error) {
        return <p>Error: {error.message}</p>;
    }

    return (
        <div>
            <h1>Classes</h1>
            {classes.length > 0 ? (
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Sample Name</th>
                            <th>Duration</th>  
                            <th>Start Time</th>
                            <th>End Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {classes.map(classs => (   
                            <tr key={classs.id}>
                            <td>{classs.sample.name}</td>
                            <td>{classs.duration}</td>
                            <td>{classs.start_time}</td>
                            <td>{classs.end_time}</td>
                            </tr>
                        ))}
                    </tbody>

                </table>
            ) : (
                <p>No classes found</p>
            )}

        </div>
    );
}

export default Classes;