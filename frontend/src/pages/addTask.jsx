import styles from '../styles/addTask.module.css';
import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigator from '../components/navigator';


// AddTask component
function AddTask() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const navigate = useNavigate();

    // Handle form submission to add a new task
    const handleAddTask = async (e) => {
        e.preventDefault();

        const res = await fetch('http://localhost:5000/addTask', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include', // Allows sending cookies
            body: JSON.stringify({ title, content })
        });

        const data = await res.json();
        if (res.ok) {
            console.log("Success:", data.msg);
        } else {
            console.error("Error:", data.msg);
        }

        navigate('/dashboard'); // Redirect to dashboard after adding task
    };

    return (
        <div>
            <Navigator title="Add Task" />
            <div className={styles.wrapper}>
                <form onSubmit={handleAddTask} className={styles.container}>
                    {/* Input for task title */}
                    <label htmlFor="title">Title</label>
                    <input
                        type="text"
                        id="title"
                        className={styles.inputTitle}
                        onChange={(e) => setTitle(e.target.value)}
                    />

                    {/* Textarea for task content */}
                    <label htmlFor="task">Task</label>
                    <textarea
                        id="task"
                        className={styles.inputContent}
                        onChange={(e) => setContent(e.target.value)}
                    ></textarea>

                    {/* Submit button */}
                    <button className={styles.button} type="submit">Add</button>
                </form>
            </div>
        </div>
    );
}

export default AddTask;
