import { useEffect, useState } from "react";
import { getTaskById } from "../api/taskService.js";
import { Link, useParams } from "react-router-dom";
import "../css/TaskDetailsPage.css";
import { Eye, Pencil, ArrowLeft } from "lucide-react";
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

export default function TaskDetailsPage() {
    const title = "Task Details";
    const { id } = useParams();

    const [task, setTask] = useState(null);
    const [loadState, setLoadState] = useState("loading"); // "loading" | "ready" | "error"

    useEffect(() => {
        let cancelled = false;
        setLoadState("loading");

        getTaskById(id)
            .then((data) => {
                if (cancelled) return;
                setTask(data);
                setLoadState("ready");
            })
            .catch((error) => {
                if (cancelled) return;
                console.error("failed to load task", error);
                setLoadState("error");
            });

        return () => {
            cancelled = true;
        };
    }, [id]);

    // Same rule as the backend's findRetardTasks: deadline passed and not DONE
    const overdue = task && task.statut !== "DONE" && new Date(task.deadline) < new Date();

    return (
        <div>
            <Header title={title} icon={<Eye size={38} />} />

            <main className="det-main">
                {loadState === "loading" && (
                    <p className="det-state" role="status">Loading task…</p>
                )}

                {loadState === "error" && (
                    <div className="det-state det-state--error" role="alert">
                        <p>This task could not be loaded. It may have been deleted.</p>
                        <Link to="/tasks" className="det-btn det-btn--ghost">
                            <ArrowLeft size={18} aria-hidden="true" />
                            <span>Back to list</span>
                        </Link>
                    </div>
                )}

                {loadState === "ready" && task && (
                    <article className={`det-card${overdue ? " det-card--overdue" : ""}`}>
                        <header className="det-head">
                            <div className="det-badges">
                                <span className={`det-badge det-badge--${task.statut.toLowerCase().replace("_", "-")}`}>
                                    {STATUT_LABELS[task.statut] ?? task.statut}
                                </span>
                                <span className={`det-priority det-priority--${task.priorite.toLowerCase()}`}>
                                    {PRIORITE_LABELS[task.priorite] ?? task.priorite} priority
                                </span>
                            </div>
                            <h2 className="det-title">{task.titre}</h2>
                        </header>

                        <section className="det-section">
                            <h3 className="det-label">Description</h3>
                            <p className="det-desc">{task.description}</p>
                        </section>

                        <dl className="det-meta">
                            <div className="det-meta-item">
                                <dt>Deadline</dt>
                                <dd>
                                    {new Date(task.deadline).toLocaleString()}
                                    {overdue && <span className="det-overdue-tag">Overdue</span>}
                                </dd>
                            </div>
                            <div className="det-meta-item">
                                <dt>Created</dt>
                                <dd>{new Date(task.dateCreation).toLocaleString()}</dd>
                            </div>
                        </dl>

                        <div className="det-actions">
                            <Link to="/tasks" className="det-btn det-btn--ghost">
                                <ArrowLeft size={18} aria-hidden="true" />
                                <span>Back to list</span>
                            </Link>
                            <Link to={`/tasks/${task.id}/edit`} className="det-btn det-btn--primary">
                                <Pencil size={18} aria-hidden="true" />
                                <span>Edit task</span>
                            </Link>
                        </div>
                    </article>
                )}
            </main>

            <Footer />
        </div>
    );
}