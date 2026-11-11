import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { AuthProvider } from '@/features/auth/AuthProvider'
import { DemoAuthProvider } from '@/features/auth/DemoAuthProvider'
import { env } from '@/lib/env'
import { router } from '@/app/router'
import './index.css'

const Provider = env.demoMode ? DemoAuthProvider : AuthProvider

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>,
)
