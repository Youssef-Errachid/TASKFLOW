import {useEffect, useState} from "react";
import {getTaskById} from "../api/taskService.js";
import {Link, useParams} from "react-router-dom";
import "../css/TaskDetailsPage.css";
export default function TaskDetailsPage() {

    const {id} = useParams();


    const [task , setTask] = useState(null);

    useEffect(() =>{
        getTaskById(id).then((data) =>{
            setTask(data);
        });
    },[id]);

    if(!task) return <p>loading...</p>

    return (
        <div className="task-details">
            <h2>Task: {task.titre}</h2>
            <p>Description: {task.description}</p>
            <div><span>statut:{task.statut}</span></div>
            <div><span>priorite:{task.priorite}</span></div>
            <div><span>Created: {new Date(task.deadline).toLocaleString()}</span></div>
            <div><span>Created: {new Date(task.dateCreation).toLocaleString()}</span></div>

            <div className="task-details-links">
                <Link to={`/tasks/${task.id}/edit`}>edit</Link>{" "}
                <Link to="/tasks">Back to List</Link>
            </div>


        </div>
    );
}