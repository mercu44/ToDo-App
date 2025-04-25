import styles from '../styles/addTask.module.css';
import { Link, useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigator from '../components/navigator.jsx'


// EditTask component
function EditTask() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const navigate = useNavigate();
    const { id } = useParams(); // Get task ID from URL

    // Fetch the task data when the component mounts
    useEffect(() => {
        const fetchTask = async () => {
            const res = await fetch(`http://localhost:5000/tasks/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });

            const data = await res.json();
            if (res.ok) {
                setTitle(data.title);
                setContent(data.content);
            } else {
                console.error("Task not found");
            }
        };

        fetchTask();
    }, [id]);

    // Handle form submission to update task
    const handleEditTask = async (e) => {
        e.preventDefault();

        const res = await fetch(`http://localhost:5000/tasks/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ title, content })
        });

        const data = await res.json();
        if (res.ok) {
            console.log("Success:", data.msg);
        } else {
            console.error("Error:", data.msg);
        }

        navigate('/dashboard'); // Redirect to dashboard after editing
    };

    return (
        <div>
            <Navigator title="Edit Task"/>
            <div className={styles.wrapper}>
                <form onSubmit={handleEditTask} className={styles.container}>
                    {/* Title input */}
                    <label htmlFor="title">Title</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        className={styles.inputTitle}
                        onChange={(e) => setTitle(e.target.value)}
                    />

                    {/* Content textarea */}
                    <label htmlFor="task">Task</label>
                    <textarea
                        id="task"
                        className={styles.inputContent}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    ></textarea>

                    {/* Submit button */}
                    <button className={styles.button} type="submit">Edit</button>
                </form>
            </div>
        </div>
    );
}

export default EditTask;
