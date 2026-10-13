import * as yup from "yup";

export const taskSchema = yup.object({
    titre: yup
        .string()
        .trim()
        .required("the title is required"),
    description: yup
        .string()
        .trim()
        .required("the description is required"),
    statut: yup.string().required("status is required"),

    priorite: yup.string().required("priorite is required"),

    deadline: yup
        .string()
        .required("dead line is required"),
});