import {Eye, ListChecks, Pencil, Trash2} from "lucide-react";
import "../css/OverdueTasksPage.css"
import {Link} from "react-router-dom";
import {useEffect, useState} from "react";
import {overdueTasks,deleteTask} from "../api/taskService.js";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";



export default function OverdueTasksPage(){
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        const fetchOverduetasks = async  ()=> {
            try {
                const data = await overdueTasks();
                setTasks(data);
            } catch (error) {
                console.error("faild to load data: " + error);
            }
        };
            fetchOverduetasks();
    }, []);

    const handleDelete = async (task) => {
        const confirmed = window.confirm("are you sure you want to delete: " + task.titre + " ?")
        if (!confirmed) return;

        try {
            await deleteTask(task.id);
        } catch (error) {
            console.error("delete failed", error);
        };
    }

    return <div>
        <Header title={ "Overdue Tasks "} icon={<ListChecks size={38}/>}/>

        <div className="table-container">
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
               {tasks.length === 0 ? (
                   <tr>
                       <td colSpan="7" style={{ textAlign: "center", color: "#bf0404" }}>
                           No tasks found
                       </td>
                   </tr>
               ) : (
                   tasks.map((task) => (
                       <tr key={task.id}>
                           <td>{task.id}</td>
                           <td>{task.titre}</td>
                           <td>{task.description}</td>
                           <td>{task.statut}</td>
                           <td>{task.priorite}</td>
                           <td>{new Date(task.deadline).toLocaleString()}</td>
                           <td>
                               <Link to={`/tasks/${task.id}`}>
                                   <Eye size={18} />
                               </Link>{" "}
                               <Link to={`/tasks/${task.id}/edit`}>
                                   <Pencil size={18} />
                               </Link>{" "}
                               <button onClick={() => handleDelete(task)}>
                                   <Trash2 size={18} />
                               </button>
                           </td>
                       </tr>
                   ))
               )}
               </tbody>
           </table>
       </div>
        <Footer/>
    </div>
}