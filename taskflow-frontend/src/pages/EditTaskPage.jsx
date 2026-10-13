import {useEffect, useState } from "react";
import {getTaskById,updateTask} from "../api/taskService.js"
import {useNavigate, useParams} from "react-router-dom";
import "../css/EditTaskPage.css"

export default function EditTaskPage() {
    const navigate = useNavigate();

    const {id} = useParams();

    const [task , setTask] = useState({
        titre:"",
        description:"",
        statut:"",
        priorite:"",
        deadline:"",
    });

    useEffect(() =>{
        getTaskById(id).then((data) =>{
            setTask({
                titre:data.titre,
                description:data.description,
                statut:data.statut,
                priorite:data.priorite,
                deadline:data.deadline.slice(0,16),
            });
        });
    },[id]);

    const handleChange = (e)=> {
        setTask({...task,[e.target.name]: e.target.value})
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            await updateTask(id,task);
        }catch (error){
            console.error("failed", error)
        }
    }
    return (
        <div>
            <h1 className="page-title">Edit Task </h1>
            <form className="edit-task-form" onSubmit={handleSubmit}>
                <label>titre
                    <input type="text" name="titre" placeholder="titre" value={task.titre} onChange={handleChange}/>
                </label>
                <label>description
                    <input type="text" name="description" placeholder="description" value={task.description} onChange={handleChange}/>
                </label>
                <select name="statut" value={task.statut} onChange={handleChange}>
                    <option value="">chose statut</option>
                    <option value="TODO">To Do</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="DONE">Done</option>
                </select>
                <select name="priorite" value={task.priorite} onChange={handleChange}>
                    <option value="">Priorite</option>
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                </select>
                <label>
                    Deadline
                    <input type="datetime-local" name="deadline" value={task.deadline} onChange={handleChange}/>
                </label>
                <div className="task-buttons">
                <button type="button" onClick={() => navigate("/tasks")}>Cancel</button>
                <button type="submit">Save</button>
                </div>
            </form>
        </div>
    );
}