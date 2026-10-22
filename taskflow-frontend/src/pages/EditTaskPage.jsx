import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getTaskById, updateTask } from "../api/taskService.js";
import { taskSchema } from "../validation/taskSchema.js";
import "../css/CreateTaskPage.css"; // shared form styles (ct-* classes)
import "../css/EditTaskPage.css";   // loading / load-error states only (et-* classes)
import Header from "../components/Header.jsx";
import { Pencil } from "lucide-react";
import Footer from "../components/Footer.jsx";

// Limits taken from the DB migration: titre VARCHAR(100), description VARCHAR(250)
const TITRE_MAX = 100;
const DESCRIPTION_MAX = 250;

function Field({ id, label, error, hint, children }) {
    return (
        <div className={`ct-field${error ? " ct-field--invalid" : ""}`}>
            <label className="ct-label" htmlFor={id}>{label}</label>
            {children}
            {error ? (
                <p className="ct-error" id={`${id}-error`} role="alert">{error}</p>
            ) : (
                hint && <p className="ct-hint" id={`${id}-hint`}>{hint}</p>
            )}
        </div>
    );
}

export default function EditTaskPage() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [loadState, setLoadState] = useState("loading"); // "loading" | "ready" | "error"
    const [submitError, setSubmitError] = useState("");

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: yupResolver(taskSchema),
        mode: "onTouched",
        defaultValues: {
            titre: "",
            description: "",
            statut: "",
            priorite: "",
            deadline: "",
        },
    });

    useEffect(() => {
        let cancelled = false;
        setLoadState("loading");

        getTaskById(id)
            .then((data) => {
                if (cancelled) return;
                reset({
                    titre: data.titre ?? "",
                    description: data.description ?? "",
                    statut: data.statut ?? "",
                    priorite: data.priorite ?? "",
                    deadline: data.deadline ? data.deadline.slice(0, 16) : "",
                });
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
    }, [id, reset]);

    const descriptionLength = watch("description")?.length ?? 0;

    const onSubmit = async (data) => {
        setSubmitError("");
        try {
            await updateTask(id, data);
            navigate("/tasks");
        } catch (error) {
            console.error("failed", error);
            setSubmitError("The changes could not be saved. Check the fields and try again.");
        }
    };

    const describedBy = (fieldId, error, hint) =>
        error ? `${fieldId}-error` : hint ? `${fieldId}-hint` : undefined;

    return (
        <div>
            <Header title={"Edit Task "} icon={<Pencil size={38} />} />

            <main className="ct-main">
                {loadState === "loading" && (
                    <p className="et-status" role="status">Loading task…</p>
                )}

                {loadState === "error" && (
                    <div className="et-status et-status--error" role="alert">
                        <p>This task could not be loaded. It may have been deleted.</p>
                        <Link to="/tasks" className="ct-btn ct-btn--ghost et-back">Back to tasks</Link>
                    </div>
                )}

                {loadState === "ready" && (
                    <form className="ct-card" onSubmit={handleSubmit(onSubmit)} noValidate>
                        <div className="ct-card-head">
                            <h2 className="ct-card-title">Task details</h2>
                            <p className="ct-card-sub">Update the fields below, then save your changes.</p>
                        </div>

                        {submitError && (
                            <div className="ct-alert" role="alert">{submitError}</div>
                        )}

                        <Field id="titre" label="Title" error={errors.titre?.message}>
                            <input
                                id="titre"
                                type="text"
                                maxLength={TITRE_MAX}
                                placeholder="Task title"
                                aria-invalid={!!errors.titre}
                                aria-describedby={describedBy("titre", errors.titre)}
                                {...register("titre")}
                            />
                        </Field>

                        <Field id="description" label="Description" error={errors.description?.message}>
                            <textarea
                                id="description"
                                rows={4}
                                maxLength={DESCRIPTION_MAX}
                                placeholder="What needs to be done?"
                                aria-invalid={!!errors.description}
                                aria-describedby={describedBy("description", errors.description)}
                                {...register("description")}
                            />
                            <span className="ct-counter" aria-hidden="true">
                                {descriptionLength}/{DESCRIPTION_MAX}
                            </span>
                        </Field>

                        <div className="ct-row">
                            <Field id="statut" label="Status" error={errors.statut?.message}>
                                <select
                                    id="statut"
                                    aria-invalid={!!errors.statut}
                                    aria-describedby={describedBy("statut", errors.statut)}
                                    {...register("statut")}
                                >
                                    <option value="">Choose a status</option>
                                    <option value="TODO">To Do</option>
                                    <option value="IN_PROGRESS">In Progress</option>
                                    <option value="DONE">Done</option>
                                </select>
                            </Field>

                            <Field id="priorite" label="Priority" error={errors.priorite?.message}>
                                <select
                                    id="priorite"
                                    aria-invalid={!!errors.priorite}
                                    aria-describedby={describedBy("priorite", errors.priorite)}
                                    {...register("priorite")}
                                >
                                    <option value="">Choose a priority</option>
                                    <option value="LOW">Low</option>
                                    <option value="MEDIUM">Medium</option>
                                    <option value="HIGH">High</option>
                                </select>
                            </Field>
                        </div>

                        <Field
                            id="deadline"
                            label="Deadline"
                            error={errors.deadline?.message}
                            hint="Must be a date and time in the future."
                        >
                            <input
                                id="deadline"
                                type="datetime-local"
                                aria-invalid={!!errors.deadline}
                                aria-describedby={describedBy("deadline", errors.deadline, true)}
                                {...register("deadline")}
                            />
                        </Field>

                        <div className="ct-actions">
                            <button
                                type="button"
                                className="ct-btn ct-btn--ghost"
                                onClick={() => navigate("/tasks")}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </button>
                            <button type="submit" className="ct-btn ct-btn--primary" disabled={isSubmitting}>
                                {isSubmitting ? "Saving…" : "Save changes"}
                            </button>
                        </div>
                    </form>
                )}
            </main>

            <Footer />
        </div>
    );
}