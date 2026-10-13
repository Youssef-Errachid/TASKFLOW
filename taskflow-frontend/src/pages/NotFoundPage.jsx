import "../css/NotFoundPage.css";

export default function NotFoundPage() {
    return (
        <div className="not-found">
            <h1>404</h1>
            <h2>Page Not Found</h2>
            <p>Please choose a correct path.</p>
            <a href="/tasks">Back to Tasks</a>
        </div>
    );
}