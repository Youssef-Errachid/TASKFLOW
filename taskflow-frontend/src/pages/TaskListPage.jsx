import {useEffect, useState} from "react";
import {getTasks, deleteTask} from "../api/taskService.js";
import { Link } from "react-router-dom";
import "../css/TaskListPage.css";
import {Plus, Eye, Pencil, Trash2, Search,ListChecks} from "lucide-react";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";


export default function TaskListPage() {
    const [tasks, setTasks] = useState([]);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("");
    const [page,setPage] = useState(0);
    const [totalElements , setTotalElements] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const title = "Tasks List";

    useEffect(() => {
       const timer = setTimeout(() => {
           getTasks(page, 10, search,filter).then((data) => {
               setTasks(data.content);
               setTotalElements(data.totalElements);
               setTotalPages(data.totalPages);
           })
               .catch((error) => console.error("failed", error));
       },400);
            return () => clearTimeout(timer);
        }, [search,page,filter]);



    const handleDelete = async (task) => {
        const confirmed = window.confirm("are you sure you want to delete: " + task.titre + " ?")
        if (!confirmed) return;

        try {
            await deleteTask(task.id);
            if (tasks.length === 1 && page > 0) {
                setPage(page - 1);
            } else {
                const data = await getTasks(page, 10, search);
                setTasks(data.content);
                setTotalElements(data.totalElements);
                setTotalPages(data.totalPages);
            }
        } catch (error) {
            console.error("delete failed", error);
        };
    }

    return (
        <div>
            <div>
                <Header title={title} icon={<ListChecks size={38}/>}/>
            </div>
            <div className="container-newtask-btn">
                <div className="filters">
                    <div className="search-box">
                        <Search size={18}/>
                        <input type="text"
                               placeholder="search by titre"
                               value={search} onChange={(e)=> {setSearch(e.target.value); setPage(0)}}/>
                    </div>
                    <div className="filter-box">
                        <select  value={filter} onChange={(e)=>{setFilter(e.target.value); setPage(0)}}>
                            <option value="">chose statut</option>
                            <option value="TODO">To Do</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="DONE">Done</option>
                        </select>
                    </div>
                </div>

                <Link to="/tasks/new" className="btn-newtask">
                    <Plus size={18}/>{"  "} <span> add new task </span>
                </Link>
            </div>
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
                    {totalElements === 0 && (
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
                                <Link to={`/tasks/${task.id}`}><Eye size={18}/></Link>{"  "}
                                <Link to={`/tasks/${task.id}/edit`}><Pencil size={18}/></Link>{"  "}
                                <button onClick={() =>(handleDelete(task))}><Trash2 size={18}/></button>
                            </td>
                        </tr>

                    ))}
                    </tbody>
                </table>
            </div>
            <div className="pagination">
                <button onClick={() => setPage(page - 1)} disabled={page === 0}>Previous</button>
                <span>Page {page + 1} / {totalPages}</span>
                <button onClick={() => setPage(page + 1)} disabled={page + 1 >= totalPages}>Next</button>
            </div>

            <Footer/>
        </div>
    );

}