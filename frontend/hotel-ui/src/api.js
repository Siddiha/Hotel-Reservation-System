import axios from 'axios'

// ── Direct microservice URLs (dev mode) ──────────────────────────────────────
// In production all calls go through WSO2 API Manager at http://localhost:8243
export const userApi        = axios.create({ baseURL: 'http://localhost:8081' })
export const reservationApi = axios.create({ baseURL: 'http://localhost:8082' })
export const roomApi        = axios.create({ baseURL: 'http://localhost:8083' })
export const billingApi     = axios.create({ baseURL: 'http://localhost:8084' })

// ── Attach JWT + Guest-Id to every request ───────────────────────────────────
;[userApi, reservationApi, roomApi, billingApi].forEach(instance => {
  instance.interceptors.request.use(config => {
    const token  = localStorage.getItem('token')
    const userId = localStorage.getItem('userId')
    if (token)  config.headers['Authorization'] = `Bearer ${token}`
    if (userId) config.headers['X-Guest-Id']    = userId
    return config
  })
})
