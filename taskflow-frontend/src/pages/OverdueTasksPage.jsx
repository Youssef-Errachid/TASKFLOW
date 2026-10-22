import { Eye, ClockAlert, Pencil, Trash2 } from "lucide-react";
import "../css/OverdueTasksPage.css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { overdueTasks, deleteTask } from "../api/taskService.js";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";

const STATUT_LABELS = {
    TODO: "To Do",
    IN_PROGRESS: "In Progress",
    DONE: "Done",
};

const PRIORITE_LABELS = {
    LOW: "Low",
    MEDIUM: "Medium",
    HIGH: "High",
};

const DAY_MS = 24 * 60 * 60 * 1000;

const overdueLabel = (deadline) => {
    const days = Math.floor((Date.now() - new Date(deadline).getTime()) / DAY_MS);
    if (days < 1) return "Less than a day overdue";
    return `${days} ${days === 1 ? "day" : "days"} overdue`;
};

export default function OverdueTasksPage() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        let cancelled = false;

        const fetchOverduetasks = async () => {
            try {
                const data = await overdueTasks();
                if (!cancelled) setTasks(data);
            } catch (error) {
                console.error("faild to load data: " + error);
                if (!cancelled) {
                    setErrorMessage("The overdue tasks could not be loaded. Check that the server is running and try again.");
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        };
        fetchOverduetasks();

        return () => {
            cancelled = true;
        };
    }, []);

    const handleDelete = async (task) => {
        const confirmed = window.confirm("are you sure you want to delete: " + task.titre + " ?");
        if (!confirmed) return;

        try {
            await deleteTask(task.id);
            setTasks((current) => current.filter((t) => t.id !== task.id));
            setErrorMessage("");
        } catch (error) {
            console.error("delete failed", error);
            setErrorMessage("The task could not be deleted. Try again.");
        }
    };

    const showEmpty = !loading && !errorMessage && tasks.length === 0;

    return (
        <div>
            <Header title={"Overdue Tasks "} icon={<ClockAlert size={38} />} />

            <main className="ov-main">
                {errorMessage && (
                    <div className="ov-alert" role="alert">{errorMessage}</div>
                )}

                {loading && !errorMessage && (
                    <p className="ov-state" role="status">Loading overdue tasks…</p>
                )}

                {showEmpty && (
                    <div className="ov-state">
                        <p>No overdue tasks. You are all caught up.</p>
                        <Link to="/tasks" className="ov-btn">View all tasks</Link>
                    </div>
                )}

                {tasks.length > 0 && (
                    <>
                        <p className="ov-count" aria-live="polite">
                            {tasks.length} overdue {tasks.length === 1 ? "task" : "tasks"}
                        </p>

                        <div className="ov-table-wrap">
                            <table className="ov-table">
                                <thead>
                                <tr>
                                    <th scope="col">ID</th>
                                    <th scope="col">Title</th>
                                    <th scope="col">Description</th>
                                    <th scope="col">Status</th>
                                    <th scope="col">Priority</th>
                                    <th scope="col">Deadline</th>
                                    <th scope="col">Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {tasks.map((task) => (
                                    <tr key={task.id} className="ov-row">
                                        <td data-label="ID">{task.id}</td>
                                        <td data-label="Title" className="ov-cell-title">{task.titre}</td>
                                        <td data-label="Description" className="ov-cell-desc">
                                            <span title={task.description}>{task.description}</span>
                                        </td>
                                        <td data-label="Status">
                                            <span className={`ov-badge ov-badge--${task.statut.toLowerCase().replace("_", "-")}`}>
                                                {STATUT_LABELS[task.statut] ?? task.statut}
                                            </span>
                                        </td>
                                        <td data-label="Priority">
                                            <span className={`ov-priority ov-priority--${task.priorite.toLowerCase()}`}>
                                                {PRIORITE_LABELS[task.priorite] ?? task.priorite}
                                            </span>
                                        </td>
                                        <td data-label="Deadline" className="ov-cell-deadline">
                                            <span className="ov-deadline-date">{new Date(task.deadline).toLocaleString()}</span>
                                            <span className="ov-overdue-by">{overdueLabel(task.deadline)}</span>
                                        </td>
                                        <td data-label="Actions">
                                            <div className="ov-actions">
                                                <Link
                                                    to={`/tasks/${task.id}`}
                                                    className="ov-icon-btn"
                                                    aria-label={`View ${task.titre}`}
                                                    title="View"
                                                >
                                                    <Eye size={18} />
                                                </Link>
                                                <Link
                                                    to={`/tasks/${task.id}/edit`}
                                                    className="ov-icon-btn"
                                                    aria-label={`Edit ${task.titre}`}
                                                    title="Edit"
                                                >
                                                    <Pencil size={18} />
                                                </Link>
                                                <button
                                                    type="button"
                                                    className="ov-icon-btn ov-icon-btn--danger"
                                                    aria-label={`Delete ${task.titre}`}
                                                    title="Delete"
                                                    onClick={() => handleDelete(task)}
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </main>

            <Footer />
        </div>
    );
}