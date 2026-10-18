import "../css/Dachboard.css";
import {
    ListChecks, ListPlus, ClockAlert, ListStart, TimerReset,
    CalendarCheck, Logs, CheckCheck, SquareExclamationPoint
} from "lucide-react";
import { Link } from "react-router-dom";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import {useEffect, useState} from "react";
import {countTodayTasks, countAllTasks,countOverdueTasks,countDoneTasks,topCurrentTasks,TopOverdueTasks} from "../api/taskService.js";

export default function Dachboard() {
    const [todaytasks, setTodaytasks] = useState(0);
    const [totaltasks, setTotalTasks] = useState(0);
    const [totalOverdueTasks, setTotalOverdueTasks] = useState(0);
    const [totalDoneTasks, setTotalDoneTasks] = useState(0);
    const [fiveCurrentTasks, setFiveCurrentTasks] = useState([]);
    const [fiveTopOverdueTasks, setFiveTopOverdueTasks] = useState([]);
    useEffect(()    =>{
        try{
            countTodayTasks().then((data) =>{
                setTodaytasks(data);
            })
            countAllTasks().then((data) =>{
                setTotalTasks(data);
            })
            countOverdueTasks().then((data) =>{
                setTotalOverdueTasks(data);
            })
            countDoneTasks().then((data) =>{
                setTotalDoneTasks(data);
            })
            topCurrentTasks().then((data) =>{
                setFiveCurrentTasks(data);
            })
            TopOverdueTasks().then((data) =>{
                setFiveTopOverdueTasks(data);
            })
        }catch (error){
            console.error("failed to count today tasks" + error);
        }
    },[]);

    return (
        <div>
            <Header title={"Task Flow"} />

            <div className="quick-actions">
                <div>
                    <Link to="/tasks/new"><ListPlus size={20} /> Add New Task</Link>
                </div>
                <div>
                    <Link to="/tasks"><ListChecks size={20} /> View All Tasks</Link>
                </div>
                <div>
                    <Link to="/overduetasks"><ClockAlert size={20} /> View Overdue Tasks</Link>
                </div>
            </div>

            <div className="count-section">
                <div>
                    <CalendarCheck size={40} />
                    <span>Today tasks</span>
                    <strong>{todaytasks}</strong>
                </div>
                <div>
                    <Logs size={40} />
                    <span>Total Tasks</span>
                    <strong>{totaltasks}</strong>
                </div>
                <div>
                    <TimerReset size={40} />
                    <span>Total overdue tasks</span>
                    <strong>{totalOverdueTasks}</strong>
                </div>
                <div>
                    <CheckCheck size={40} />
                    <span>Total Done tasks</span>
                    <strong>{totalDoneTasks}</strong>
                </div>
            </div>

            <div className="top-tasks">
                <div className="task-box">
                    <h2><ListStart size={24} /> Five top new tasks</h2>
                    <table>
                        <thead>
                        <tr>
                            <th>Titre</th>
                            <th>Description</th>
                            <th>Deadline</th>
                        </tr>
                        </thead>
                        <tbody>
                        {fiveCurrentTasks.length === 0 && (
                            <tr>
                                <td colSpan="4" style={{textAlign:"center", color:"#bf0404"}}> No tasks found</td>
                            </tr>)}
                        {fiveCurrentTasks.map((task) =>(
                            <tr key={task.id}>
                                <td>{task.titre}</td>
                                <td>{task.description}</td>
                                <td>{new Date(task.deadline).toLocaleString()}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                <div className="task-box">
                    <h2><TimerReset size={24} /> Five top over due tasks</h2>
                    <table>
                        <thead>
                        <tr>
                            <th>Titre</th>
                            <th>Description</th>
                            <th>Deadline</th>
                        </tr>
                        </thead>
                        <tbody>
                        {fiveTopOverdueTasks.length === 0 && (
                            <tr>
                                <td colSpan="4" style={{textAlign:"center", color:"#bf0404"}}> No tasks found</td>
                            </tr>)}
                        {fiveTopOverdueTasks.map((task) =>(
                            <tr key={task.id}>
                                <td>{task.titre}</td>
                                <td>{task.description}</td>
                                <td>{new Date(task.deadline).toLocaleString()}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                <div className="task-box">
                    <h2><SquareExclamationPoint size={24} /> Five incomplete high-priority</h2>
                    <table>
                        <thead>
                        <tr>
                            <th>Titre</th>
                            <th>Description</th>
                            <th>Deadline</th>
                        </tr>
                        </thead>
                        <tbody>
                        {fiveCurrentTasks.length === 0 && (
                            <tr>
                                <td colSpan="4" style={{textAlign:"center", color:"#bf0404"}}> No tasks found</td>
                            </tr>)}
                        {fiveCurrentTasks.map((task) =>(
                            <tr key={task.id}>
                                <td>{task.titre}</td>
                                <td>{task.description}</td>
                                <td>{new Date(task.deadline).toLocaleString()}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

            </div>

            <Footer />
        </div>
    );
}