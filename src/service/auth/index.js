import axios from "../axios";

export const useAuth = (user) => axios.post("/login", user);
