import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import TaskListPage from "./pages/TaskListPage.jsx";
import CreateTaskPage from "./pages/CreateTaskPage.jsx";
import TaskDetailsPage from "./pages/TaskDetailsPage.jsx";
import EditTaskPage from "./pages/EditTaskPage.jsx";
import Dachboard from "./pages/Dachboard.jsx";
import OverdueTasksPage from "./pages/OverdueTasksPage.jsx";
import Header from "./components/Header.jsx";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Header />} />
                <Route path="/dachboard" element={<Dachboard/>}/>
                <Route path="/tasks" element={<TaskListPage />}/>
                <Route path="/tasks/new" element={<CreateTaskPage />}/>
                <Route path="/tasks/:id" element={<TaskDetailsPage />}/>
                <Route path="/tasks/:id/edit" element={<EditTaskPage />}/>
                <Route path="/overduetasks" element={<OverdueTasksPage/>}/>
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;