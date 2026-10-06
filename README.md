# TaskFlow

Secure full-stack task manager built with **Spring Boot**, **Spring Security + JWT** and **React (Vite)**.
Each user has a personal account and manages **only their own tasks**, with a status, a priority and a deadline.

---

## Features

**Authentication**
- Register with an encrypted password (BCrypt)
- Log in with email + password and receive a JWT
- Stateless API protected by Spring Security
- Logout on the frontend

**Tasks**
- Create, list, view, edit and delete your tasks
- Change only the status of a task
- Status: `TODO` / `IN_PROGRESS` / `DONE`
- Priority: `LOW` / `MEDIUM` / `HIGH`
- A user can never read, edit or delete another user's task

**Profile**
- View and edit your information
- Delete your account

---

## Tech Stack

| Backend | Frontend |
|---|---|
| Java 17+ | React JS + Vite |
| Spring Boot / Spring Web | React Router DOM |
| Spring Data JPA / Hibernate | Axios |
| Spring Security + JWT | React Hook Form + Yup |
| Jakarta Validation | HTML / CSS / JavaScript ES6+ |
| MySQL | |
| Maven | |

Tools: Postman, Git, GitHub

---

## Project Structure

```
TASKFLOW/
├── taskflow-backend/     # Spring Boot REST API
└── taskflow-frontend/    # React (Vite) application
```

**Backend packages** (`com.taskflow`)
```
controller/   service/   repository/   entity/
dto/          mapper/    exception/    security/    config/
```

**Frontend** (`src/`)
```
components/   pages/   services/   auth/   validations/   router/
```

---

## Data Model

```
User 1 ──────────── * Task
     @OneToMany   @ManyToOne
```

| User | Task |
|---|---|
| id | id |
| nom | titre |
| prenom | description |
| email (unique) | statut |
| password (encrypted) | priorite |
| | deadline |
| | dateCreation |

---

## API Endpoints

### Auth — public
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Create an account |
| POST | `/api/auth/login` | Log in and get a JWT |

### Users — protected
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/users/{id}` | Get a user |
| PUT | `/api/users/{id}` | Update user information |
| DELETE | `/api/users/{id}` | Delete a user |

### Tasks — protected
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/tasks` | Create a task |
| GET | `/api/tasks` | List the connected user's tasks |
| GET | `/api/tasks/{id}` | Get a task |
| PUT | `/api/tasks/{id}` | Update a task |
| DELETE | `/api/tasks/{id}` | Delete a task |
| PATCH | `/api/tasks/{id}/status` | Update only the status |

Protected endpoints require the header:
```
Authorization: Bearer <JWT>
```

---

## Getting Started

### Prerequisites
- Java 17 or higher
- Maven (or the included Maven wrapper)
- MySQL
- Node.js and npm

### 1. Clone the repository
```bash
git clone https://github.com/Youssef-Errachid/TASKFLOW.git
cd TASKFLOW
```

### 2. Backend
Create a MySQL database named `taskflow`, then configure `taskflow-backend/src/main/resources/application.properties`
(database URL, username, password, JWT secret and expiration).

> Never commit real passwords or the JWT secret. Use environment variables.

```bash
cd taskflow-backend
./mvnw spring-boot:run
```
The API runs on `http://localhost:8080`.

### 3. Frontend
Create a `.env` file in `taskflow-frontend/`:
```
VITE_API_URL=http://localhost:8080/api
```

```bash
cd taskflow-frontend
npm install
npm run dev
```
The app runs on `http://localhost:5173`.

---

## Security

- Passwords are hashed with `BCryptPasswordEncoder`
- The password is never returned by the API
- Sessions are `STATELESS`; every protected request is authenticated with the JWT
- The connected user is always read from the Spring Security context, never from the request body
- Errors are handled centrally with `@RestControllerAdvice` (400, 401, 403, 404, 409)

---

## Frontend Pages

| Page | Description |
|---|---|
| Register | Create an account |
| Login | Authenticate and store the session |
| Dashboard | Summary of the user's tasks |
| Tasks | List tasks with status, priority and deadline |
| Task Form | Create or edit a task |
| Profile | View or edit user information |
| Not Found | 404 page |

---

## Project Status

- [x] Project setup (Spring Boot + React Vite)
- [ ] Entities, repositories, DTOs, mappers
- [ ] Spring Security + JWT
- [ ] Task & user endpoints
- [ ] Frontend pages and API integration
- [ ] Tests (Postman + end-to-end)

---

## Author

**Youssef Errachid** — [GitHub](https://github.com/Youssef-Errachid)
