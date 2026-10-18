import api from "./axios";

export const getTasks = async (page ,size,search,statut) =>{
    const response = await api.get("/api/tasks",{params : {page,size,search,statut : statut || undefined,}});
    return response.data;
}

export const createTask = async (task) =>{
    const response = await api.post("/api/tasks", task);
    return response.data;
}


export const getTaskById = async (id) =>{
    const response = await api.get(`/api/tasks/${id}`);
    return response.data;
}

export const updateTask = async (id,taskData) =>{
    const response = await api.put(`/api/tasks/${id}`,taskData);
    return response.data;
}

export const deleteTask = async (id) =>{
   await api.delete(`/api/tasks/${id}`);
}

export const overdueTasks = async () =>{
    const response = await api.get(`/api/tasks/retardtasks`);
    return response.data;
}

export const countTodayTasks = async () => {
    const response = await api.get(`/api/tasks/counttodaytasks`);
    return response.data;
}

export const countAllTasks = async () => {
    const response = await api.get(`/api/tasks/countalltasks`);
    return response.data;
}

export const countOverdueTasks = async () => {
    const response = await api.get(`/api/tasks/countoverduetasks`);
    return response.data;
}

export const countDoneTasks = async () => {
    const response = await api.get(`/api/tasks/countdonetasks`);
    return response.data;
}

export const topCurrentTasks = async () =>{
    const response = await api.get(`/api/tasks/fivecurrenttasks`)
    return response.data;
}

export const TopOverdueTasks = async () =>{
    const response = await api.get(`/api/tasks/fivetopoverduetasks`)
    return response.data;
}
