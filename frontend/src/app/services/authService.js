import API from "./api";

export const register = (data) => {
    return API.post("/auth/register", data);
};

export const login = (data) => {
    return API.post("/auth/login", data);
};

export const profile = () => {
    return API.get("/auth/profile");
};

export const editProfile = (data) => {
    return API.put("/auth/profile", data);
};