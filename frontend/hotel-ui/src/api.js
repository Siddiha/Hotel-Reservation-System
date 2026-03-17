import axios from 'axios'

// Each microservice runs on its own port.
// In production these would all go through WSO2 API Manager.
export const userApi        = axios.create({ baseURL: 'http://localhost:8081' })
export const reservationApi = axios.create({ baseURL: 'http://localhost:8082' })
export const roomApi        = axios.create({ baseURL: 'http://localhost:8083' })
export const billingApi     = axios.create({ baseURL: 'http://localhost:8084' })
