import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import { createTask } from "../api/taskService.js";
import { taskSchema } from "../validation/taskSchema.js";
import "../css/CreateTaskPage.css";
import Header from "../components/Header.jsx";
import { ListChecks } from "lucide-react";
import Footer from "../components/Footer.jsx";

const TITRE_MAX = 100;
const DESCRIPTION_MAX = 250;

const nowForDatetimeLocal = () => {
    const offsetMs = new Date().getTimezoneOffset() * 60000;
    return new Date(Date.now() - offsetMs).toISOString().slice(0, 16);
};

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

export default function CreateTaskPage() {
    const navigate = useNavigate();
    const [submitError, setSubmitError] = useState("");

    const {
        register,
        handleSubmit,
        watch,
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

    const descriptionLength = watch("description")?.length ?? 0;

    const onSubmit = async (data) => {
        setSubmitError("");
        try {
            await createTask(data);
            navigate("/tasks");
        } catch (error) {
            console.error("failed", error);
            setSubmitError("The task could not be saved. Check the fields and try again.");
        }
    };

    const describedBy = (id, error, hint) =>
        error ? `${id}-error` : hint ? `${id}-hint` : undefined;

    return (
        <div>
            <Header title={"New Task "} icon={<ListChecks size={38} />} />

            <main className="ct-main">
                <form className="ct-card" onSubmit={handleSubmit(onSubmit)} noValidate>
                    <div className="ct-card-head">
                        <h2 className="ct-card-title">Task details</h2>
                        <p className="ct-card-sub">Fill in the fields below to add a task to your list.</p>
                    </div>

                    {submitError && (
                        <div className="ct-alert" role="alert">{submitError}</div>
                    )}

                    <Field id="titre" label="Title" error={errors.titre?.message}>
                        <input
                            id="titre"
                            type="text"
                            maxLength={TITRE_MAX}
                            placeholder="e.g. Prepare the sprint review"
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
                            min={nowForDatetimeLocal()}
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
                            {isSubmitting ? "Saving…" : "Save task"}
                        </button>
                    </div>
                </form>
            </main>

            <Footer />
        </div>
    );
}