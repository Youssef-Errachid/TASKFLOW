import "../css/Dachboard.css";
import {
    ListChecks, ListPlus, ClockAlert, ListStart, TimerReset,
    CalendarCheck, Logs, CheckCheck, SquareExclamationPoint
} from "lucide-react";
import { Link } from "react-router-dom";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import { useEffect, useState } from "react";
import {
    countTodayTasks, countAllTasks, countOverdueTasks, countDoneTasks,
    topCurrentTasks, TopOverdueTasks
} from "../api/taskService.js";

function TaskPanel({ icon, title, tasks, loading, overdue }) {
    return (
        <section className="db-panel">
            <h2 className="db-panel-title">
                {icon}
                <span>{title}</span>
            </h2>

            {!loading && tasks.length === 0 ? (
                <p className="db-empty">No tasks found</p>
            ) : (
                <div className="db-table-wrap">
                    <table className="db-table">
                        <thead>
                        <tr>
                            <th scope="col">Title</th>
                            <th scope="col">Description</th>
                            <th scope="col">Deadline</th>
                        </tr>
                        </thead>
                        <tbody>
                        {tasks.map((task) => (
                            <tr key={task.id}>
                                <td className="db-cell-title">
                                    <Link to={`/tasks/${task.id}`}>{task.titre}</Link>
                                </td>
                                <td className="db-cell-desc">
                                    <span title={task.description}>{task.description}</span>
                                </td>
                                <td className={`db-cell-deadline${overdue ? " db-cell-deadline--overdue" : ""}`}>
                                    {new Date(task.deadline).toLocaleString()}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
}

export default function Dachboard() {
    const [todaytasks, setTodaytasks] = useState(0);
    const [totaltasks, setTotalTasks] = useState(0);
    const [totalOverdueTasks, setTotalOverdueTasks] = useState(0);
    const [totalDoneTasks, setTotalDoneTasks] = useState(0);
    const [fiveCurrentTasks, setFiveCurrentTasks] = useState([]);
    const [fiveTopOverdueTasks, setFiveTopOverdueTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        let cancelled = false;

        // allSettled: one failing request must not hide the others
        Promise.allSettled([
            countTodayTasks(),
            countAllTasks(),
            countOverdueTasks(),
            countDoneTasks(),
            topCurrentTasks(),
            TopOverdueTasks(),
        ]).then((results) => {
            if (cancelled) return;
            const [today, all, overdue, done, current, topOverdue] = results;

            if (today.status === "fulfilled") setTodaytasks(today.value);
            if (all.status === "fulfilled") setTotalTasks(all.value);
            if (overdue.status === "fulfilled") setTotalOverdueTasks(overdue.value);
            if (done.status === "fulfilled") setTotalDoneTasks(done.value);
            if (current.status === "fulfilled") setFiveCurrentTasks(current.value);
            if (topOverdue.status === "fulfilled") setFiveTopOverdueTasks(topOverdue.value);

            const failed = results.filter((r) => r.status === "rejected");
            if (failed.length > 0) {
                failed.forEach((r) => console.error("dashboard request failed", r.reason));
                setErrorMessage("Some dashboard data could not be loaded. Check that the server is running and refresh the page.");
            }
            setLoading(false);
        });

        return () => {
            cancelled = true;
        };
    }, []);

    const stats = [
        { key: "today", label: "Today tasks", value: todaytasks, Icon: CalendarCheck, tone: "neutral" },
        { key: "total", label: "Total tasks", value: totaltasks, Icon: Logs, tone: "neutral" },
        { key: "overdue", label: "Overdue tasks", value: totalOverdueTasks, Icon: TimerReset, tone: totalOverdueTasks > 0 ? "danger" : "neutral" },
        { key: "done", label: "Done tasks", value: totalDoneTasks, Icon: CheckCheck, tone: "success" },
    ];

    return (
        <div>
            <Header title={"Dashboard"} />

            <main className="db-main">
                {errorMessage && (
                    <div className="db-alert" role="alert">{errorMessage}</div>
                )}

                <nav className="db-actions" aria-label="Quick actions">
                    <Link to="/tasks/new" className="db-btn db-btn--primary">
                        <ListPlus size={20} aria-hidden="true" />
                        <span>Add new task</span>
                    </Link>
                    <Link to="/tasks" className="db-btn db-btn--ghost">
                        <ListChecks size={20} aria-hidden="true" />
                        <span>View all tasks</span>
                    </Link>
                    <Link to="/overduetasks" className="db-btn db-btn--ghost">
                        <ClockAlert size={20} aria-hidden="true" />
                        <span>View overdue tasks</span>
                    </Link>
                </nav>

                <section className="db-stats" aria-label="Task summary">
                    {stats.map(({ key, label, value, Icon, tone }) => (
                        <div key={key} className={`db-stat db-stat--${tone}`}>
                            <span className="db-stat-icon"><Icon size={24} aria-hidden="true" /></span>
                            <strong className="db-stat-value">{loading ? "–" : value}</strong>
                            <span className="db-stat-label">{label}</span>
                        </div>
                    ))}
                </section>

                <div className="db-panels">
                    <TaskPanel
                        icon={<ListStart size={22} aria-hidden="true" />}
                        title="Five top new tasks"
                        tasks={fiveCurrentTasks}
                        loading={loading}
                    />
                    <TaskPanel
                        icon={<TimerReset size={22} aria-hidden="true" />}
                        title="Five top overdue tasks"
                        tasks={fiveTopOverdueTasks}
                        loading={loading}
                        overdue
                    />
                    {/* NOTE: as in the original code, this panel shows fiveCurrentTasks.
                        There is no high-priority request in taskService.js yet, so the data
                        below is NOT filtered by priority. */}
                    <TaskPanel
                        icon={<SquareExclamationPoint size={22} aria-hidden="true" />}
                        title="Five incomplete high-priority tasks"
                        tasks={fiveCurrentTasks}
                        loading={loading}
                    />
                </div>
            </main>

            <Footer />
        </div>
    );
}