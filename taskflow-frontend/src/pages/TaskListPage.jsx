import { useCallback, useEffect, useState } from "react";
import { getTasks, deleteTask } from "../api/taskService.js";
import { Link } from "react-router-dom";
import "../css/TaskListPage.css";
import { Plus, Eye, Pencil, Trash2, Search, ListChecks, ChevronLeft, ChevronRight } from "lucide-react";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";

const PAGE_SIZE = 10;

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

// Same rule as the backend's findRetardTasks: deadline passed and not DONE
const isOverdue = (task) => task.statut !== "DONE" && new Date(task.deadline) < new Date();

export default function TaskListPage() {
    const [tasks, setTasks] = useState([]);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("");
    const [page, setPage] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const title = "Tasks List";

    const applyData = useCallback((data) => {
        setTasks(data.content);
        setTotalElements(data.totalElements);
        setTotalPages(data.totalPages);
    }, []);

    useEffect(() => {
        let cancelled = false;
        const timer = setTimeout(() => {
            setLoading(true);
            getTasks(page, PAGE_SIZE, search, filter)
                .then((data) => {
                    if (cancelled) return;
                    applyData(data);
                    setErrorMessage("");
                })
                .catch((error) => {
                    if (cancelled) return;
                    console.error("failed", error);
                    setErrorMessage("The tasks could not be loaded. Check that the server is running and try again.");
                })
                .finally(() => {
                    if (!cancelled) setLoading(false);
                });
        }, 400);
        return () => {
            cancelled = true;
            clearTimeout(timer);
        };
    }, [search, page, filter, applyData]);

    const handleDelete = async (task) => {
        const confirmed = window.confirm("are you sure you want to delete: " + task.titre + " ?");
        if (!confirmed) return;

        try {
            await deleteTask(task.id);
            if (tasks.length === 1 && page > 0) {
                setPage(page - 1);
            } else {
                const data = await getTasks(page, PAGE_SIZE, search, filter);
                applyData(data);
            }
            setErrorMessage("");
        } catch (error) {
            console.error("delete failed", error);
            setErrorMessage("The task could not be deleted. Try again.");
        }
    };

    const hasActiveFilters = search.trim() !== "" || filter !== "";
    const showEmpty = !loading && !errorMessage && totalElements === 0;

    return (
        <div>
            <Header title={title} icon={<ListChecks size={38} />} />

            <main className="tl-main">
                <div className="tl-toolbar">
                    <div className="tl-filters">
                        <div className="tl-search">
                            <Search size={18} aria-hidden="true" />
                            <input
                                type="search"
                                aria-label="Search tasks by title"
                                placeholder="Search by title"
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setPage(0);
                                }}
                            />
                        </div>
                        <select
                            className="tl-select"
                            aria-label="Filter by status"
                            value={filter}
                            onChange={(e) => {
                                setFilter(e.target.value);
                                setPage(0);
                            }}
                        >
                            <option value="">All statuses</option>
                            <option value="TODO">To Do</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="DONE">Done</option>
                        </select>
                    </div>

                    <Link to="/tasks/new" className="tl-add">
                        <Plus size={18} aria-hidden="true" />
                        <span>Add new task</span>
                    </Link>
                </div>

                {errorMessage && (
                    <div className="tl-alert" role="alert">{errorMessage}</div>
                )}

                {loading && tasks.length === 0 && !errorMessage && (
                    <p className="tl-state" role="status">Loading tasks…</p>
                )}

                {showEmpty && (
                    <div className="tl-state">
                        {hasActiveFilters ? (
                            <p>No task matches your search or filter.</p>
                        ) : (
                            <>
                                <p>You have no tasks yet.</p>
                                <Link to="/tasks/new" className="tl-add">
                                    <Plus size={18} aria-hidden="true" />
                                    <span>Add your first task</span>
                                </Link>
                            </>
                        )}
                    </div>
                )}

                {totalElements > 0 && (
                    <>
                        <p className="tl-count" aria-live="polite">
                            {totalElements} {totalElements === 1 ? "task" : "tasks"}
                        </p>

                        <div className={`tl-table-wrap${loading ? " tl-table-wrap--loading" : ""}`}>
                            <table className="tl-table">
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
                                {tasks.map((task) => {
                                    const overdue = isOverdue(task);
                                    return (
                                        <tr key={task.id} className={overdue ? "tl-row tl-row--overdue" : "tl-row"}>
                                            <td data-label="ID">{task.id}</td>
                                            <td data-label="Title" className="tl-cell-title">{task.titre}</td>
                                            <td data-label="Description" className="tl-cell-desc">
                                                <span title={task.description}>{task.description}</span>
                                            </td>
                                            <td data-label="Status">
                                                <span className={`tl-badge tl-badge--${task.statut.toLowerCase().replace("_", "-")}`}>
                                                    {STATUT_LABELS[task.statut] ?? task.statut}
                                                </span>
                                            </td>
                                            <td data-label="Priority">
                                                <span className={`tl-priority tl-priority--${task.priorite.toLowerCase()}`}>
                                                    {PRIORITE_LABELS[task.priorite] ?? task.priorite}
                                                </span>
                                            </td>
                                            <td data-label="Deadline" className="tl-cell-deadline">
                                                <span>{new Date(task.deadline).toLocaleString()}</span>
                                                {overdue && <span className="tl-overdue-tag">Overdue</span>}
                                            </td>
                                            <td data-label="Actions">
                                                <div className="tl-actions">
                                                    <Link
                                                        to={`/tasks/${task.id}`}
                                                        className="tl-icon-btn"
                                                        aria-label={`View ${task.titre}`}
                                                        title="View"
                                                    >
                                                        <Eye size={18} />
                                                    </Link>
                                                    <Link
                                                        to={`/tasks/${task.id}/edit`}
                                                        className="tl-icon-btn"
                                                        aria-label={`Edit ${task.titre}`}
                                                        title="Edit"
                                                    >
                                                        <Pencil size={18} />
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        className="tl-icon-btn tl-icon-btn--danger"
                                                        aria-label={`Delete ${task.titre}`}
                                                        title="Delete"
                                                        onClick={() => handleDelete(task)}
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                                </tbody>
                            </table>
                        </div>

                        <nav className="tl-pagination" aria-label="Pagination">
                            <button
                                type="button"
                                className="tl-page-btn"
                                onClick={() => setPage(page - 1)}
                                disabled={page === 0}
                            >
                                <ChevronLeft size={18} aria-hidden="true" />
                                <span>Previous</span>
                            </button>
                            <span className="tl-page-info">
                                Page {page + 1} of {Math.max(totalPages, 1)}
                            </span>
                            <button
                                type="button"
                                className="tl-page-btn"
                                onClick={() => setPage(page + 1)}
                                disabled={page + 1 >= totalPages}
                            >
                                <span>Next</span>
                                <ChevronRight size={18} aria-hidden="true" />
                            </button>
                        </nav>
                    </>
                )}
            </main>

            <Footer />
        </div>
    );
}