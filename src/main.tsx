import App from '@/App'
import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'

const root = document.getElementById('root')

ReactDOM.createRoot(root!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
