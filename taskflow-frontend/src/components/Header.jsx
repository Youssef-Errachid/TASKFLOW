import { LayoutDashboard, MailQuestionMark } from "lucide-react";
import { Link } from "react-router-dom";
import "../css/Header.css";

export default function Header({ title = "TaskFlow Header", icon }) {
    return (
        <header className="hd">
            <div className="hd-inner">
                <Link to="/dachboard" className="hd-nav-btn" aria-label="Go to dashboard" title="Dashboard">
                    <LayoutDashboard size={24} aria-hidden="true" />
                </Link>

                {icon && (
                    <span className="hd-page-icon" aria-hidden="true">{icon}</span>
                )}

                <div className="hd-text">
                    <h1 className="hd-title">{title}</h1>
                    <p className="hd-tagline">Manage and track all your tasks</p>
                </div>

                <Link to="/dachboard" className="hd-nav-btn" aria-label="Go to dashboard" title="Dashboard">
                    <MailQuestionMark size={24} aria-hidden="true" />
                </Link>
            </div>
        </header>
    );
}