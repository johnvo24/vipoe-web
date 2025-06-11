import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
  withCredentials: true,
});

export const aiApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_AI_API_URL,
  withCredentials: false, // thường AI không cần auth
});