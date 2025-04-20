import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './Styles/index.css'
import App from './App.tsx'
import Header from './Components/Header.tsx'
import { AuthProvider } from './Components/AuthContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Header/>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
)
