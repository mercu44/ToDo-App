import { Link } from 'react-router-dom';
import styles from '../styles/tasks.module.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigator from '../components/navigator.jsx'


// Component to list and manage tasks
function Tasks() {
    const [tasks, setTasks] = useState([]);
    const navigate = useNavigate();

    // Fetch all tasks from the backend
    const requestTasks = async () => {
        const res = await fetch(`http://localhost:5000/tasks`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json'
            },
            credentials: 'include',
        });

        const data = await res.json();
        if (res.ok) {
            setTasks(data);
        } else {
            console.error('Failed to fetch tasks');
        }
    };

    // Delete a specific task by ID
    const deleteTask = async (id) => {
        const res = await fetch(`http://localhost:5000/tasks/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json'
            },
            credentials: 'include'
        });
        if (res.ok) {
            requestTasks(); // Refresh task list
        }
    };

    // Toggle the task status (done/undone)
    const checkBox = async (id, doneValue) => {
        const res = await fetch(`http://localhost:5000/tasks/${id}`, {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ done: doneValue })
        });

        const data = await res.json();
        if (res.ok) {
            requestTasks(); // Refresh task list
            console.log(data.msg);
        }
    };

    // Navigate to the add task page
    const handleAddClick = () => {
        navigate('/addTask');
    };

    // Load tasks on component mount
    useEffect(() => {
        requestTasks();
    }, []);

    return (
        <div>
            <Navigator title="Dashboard"/>

            <div className={styles.container}>
                {/* Button to add a new task */}
                <button className={styles.addButton} onClick={handleAddClick}>+ Add</button>

                <ul>
                    {tasks.map((task) => (
                        <li className={styles.card} key={task.id}>
                            
                            <div className={task.status ? styles.bodyCardDone : styles.bodyCard}>
                                <input
                                    type="checkbox"
                                    checked={task.status}
                                    id="btnCheck"
                                    className={styles.checkBox}
                                    onChange={(e) => checkBox(task.id, e.target.checked)}
                                />
                                <div className={styles.cardContent}>
                                    <h3 className ={styles.title}>{task.title}</h3>
                                    <p className ={styles.content}>{task.content}</p>
                                </div>
                                <div className={styles.cardButtons}>
                                    {/* Edit task button */}
                                    <button
                                        className={styles.editButton}
                                        onClick={() => navigate(`/editTask/${task.id}`)}
                                    >
                                        Edit
                                    </button>

                                    {/* Delete task button */}
                                    <button
                                        className={styles.deleteButton}
                                        onClick={() => deleteTask(task.id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default Tasks;
