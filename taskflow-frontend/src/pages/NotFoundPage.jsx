import "../css/NotFoundPage.css";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
    return (
        <div className="not-found">
            <h1>404</h1>
            <h2>Page Not Found</h2>
            <p>Please choose a correct path.</p>
            <Link to={"/tasks"}>Back to Tasks</Link>
        </div>
    );
}