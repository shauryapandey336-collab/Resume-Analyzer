import API from "./api";

export const chatbot = (data) =>
    API.post("/chatbot", data);