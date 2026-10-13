import {useEffect, useState} from "react";
import {getTasks, deleteTask} from "../api/taskService.js";
import { Link } from "react-router-dom";
import "../css/TaskListPage.css";


export default function TaskListPage() {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        getTasks().then((data) => {
            console.log(data);
            setTasks(data);
        });
    }, []);

    const handleDelete = async (task) => {
        const confirmed = window.confirm("are you sure you want to delete: " + task.titre + " ?")
        if (!confirmed) return;

        try {
            await deleteTask(task.id);
            setTasks(tasks.filter((t) => t.id !== task.id));
        } catch (error) {
            console.error("delete failed", error);
        };
    }

    return (
        <div>
            <h1 className="page-title">
                Tasks
            </h1>
            <p className="task-subtitle">
                Manage and track all your tasks ({tasks.length} total)
            </p>
            <div className="container-newtask-btn">
                <Link to="/tasks/new" className="btn-newtask">
                    new task
                </Link>
            </div>
            <table className="table">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Titre</th>
                    <th>Description</th>
                    <th>Statut</th>
                    <th>Priorite</th>
                    <th>Deadline</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {tasks.length === 0 && (
                    <tr>
                        <td colSpan="7" style={{textAlign:"center", color:"#bf0404"}}> No tasks found</td>
                    </tr>
                )}
                {tasks.map((task) =>(
                    <tr key={task.id}>
                        <td>{task.id}</td>
                        <td>{task.titre}</td>
                        <td>{task.description}</td>
                        <td>{task.statut}</td>
                        <td>{task.priorite}</td>
                        <td>{new Date(task.deadline).toLocaleString()}</td>
                        <td>
                            <Link to={`/tasks/${task.id}`}>view</Link>{"  "}
                            <Link to={`/tasks/${task.id}/edit`}>edit</Link>{"  "}
                            <button onClick={() =>(handleDelete(task))}>delete</button>
                        </td>
                    </tr>

                ))}

                </tbody>
            </table>

        </div>
    );

}