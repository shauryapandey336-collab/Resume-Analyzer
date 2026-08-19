import API from "./api";

export const dashboard = () =>
    API.get("/dashboard");