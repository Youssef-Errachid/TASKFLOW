import {useForm} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {useNavigate} from "react-router-dom";
import {createTask} from "../api/taskService.js"
import { taskSchema} from "../validation/taskSchema.js";
import "../css/CreateTaskPage.css"

export default function CreateTaskPage() {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState:{errors,isSubmitting},
    } = useForm({resolver: yupResolver(taskSchema)});

    const onSubmit = async (data) => {
        try{
            await createTask(data);
            navigate("/tasks")
        }catch (error){
            console.error("failed", error)
        }
    }
    return (
        <div>
            <h1 className="page-title">New Task </h1>
            <p className="task-subtitle">
                create new task
            </p>
            <form className="task-form" onSubmit={handleSubmit(onSubmit)}noValidate>
                <label>titre
                    <input type="text"  {...register("titre")} placeholder="titre" />
                </label>
                <p>{errors.titre?.message}</p>

                <label>description
                    <input type="text"  placeholder="description" {...register("description")} />
                </label>
                <p>{errors.description?.message}</p>

                <label>
                    Statut
                </label>
                <select {...register("statut")} >
                    <option value="">chose statut</option>
                    <option value="TODO">To Do</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="DONE">Done</option>
                </select>
                <p>{errors.statut?.message}</p>

                <label>
                    Priorite
                </label>
                <select {...register("priorite")} >
                    <option value="">Priorite</option>
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                </select>
                <p>{errors.priorite?.message}</p>

                <label>
                    Deadline
                    <input type="datetime-local" {...register("deadline")}/>
                </label>
                <p>{errors.deadline?.message}</p>

                <div className="task-buttons">
                    <button type="button" onClick={() => navigate("/tasks")}>Cancel</button>
                    <button type="submit" disabled={isSubmitting}>Save</button>
                </div>
            </form>
        </div>
    );
}