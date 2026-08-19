import API from "./api";

export const uploadResume = (formData) => {

    return API.post(

        "/resume/upload",

        formData,

        {

            headers: {

                "Content-Type": "multipart/form-data"

            }

        }

    );

}

export const getAllResumes = () =>
    API.get("/resume/all");

export const parser = (id) =>
    API.get(`/resume/parser/${id}`);

export const skills = (id) =>
    API.get(`/resume/skills/${id}`);

export const ats = (id) =>
    API.get(`/resume/ats/${id}`);

export const resumeScore = (id) =>
    API.get(`/resume/score/${id}`);

export const suggestion = (id) =>
    API.get(`/resume/ai-suggestion/${id}`);

export const jobMatch = (data) =>
    API.post("/resume/job-match", data);