import {LayoutDashboard,MailQuestionMark} from "lucide-react";
import {Link} from "react-router-dom"
import "../css/Header.css"

export default function Header({title,icon}){
    return (
        <div>

            <div className="app-title">
                <div className="dashboard-icon">
                    <Link to={`/dachboard`}><LayoutDashboard size={40}  /></Link>
                </div>
                {icon}
                <div>
                    <h1>{title}</h1>
                    <p>Manage and track all your tasks</p>
                </div>
                <div className="icon">
                    <Link to={`/dachboard`}><MailQuestionMark  size={40}  /></Link>
                </div>
            </div>
        </div>
    )
}
