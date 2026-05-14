import ReactDOM from 'react-dom/client'
import { AuthProvider } from '@asgardeo/auth-react'
import App from './App.jsx'

const authConfig = {
  signInRedirectURL:  'http://localhost:5173/callback',
  signOutRedirectURL: 'http://localhost:5173/login',
  clientID:           'ljE0BHhDH1XkuGFQFVv5v7G3fUwa',
  baseUrl:            'https://api.asgardeo.io/t/siddiha',
  scope:              ['openid', 'profile'],
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthProvider config={authConfig}>
    <App />
  </AuthProvider>
)
