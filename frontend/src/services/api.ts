import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL ?? 'https://localhost:5001/api'

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})
