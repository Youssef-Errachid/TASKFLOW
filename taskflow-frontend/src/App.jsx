import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import TaskListPage from "./pages/TaskListPage.jsx";
import CreateTaskPage from "./pages/CreateTaskPage.jsx";
import TaskDetailsPage from "./pages/TaskDetailsPage.jsx";
import EditTaskPage from "./pages/EditTaskPage.jsx";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/tasks" replace />} />
                <Route path="/tasks" element={<TaskListPage />}/>
                <Route path="/tasks/new" element={<CreateTaskPage />}/>
                <Route path="/tasks/:id" element={<TaskDetailsPage />}/>
                <Route path="/tasks/:id/edit" element={<EditTaskPage />}/>
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;