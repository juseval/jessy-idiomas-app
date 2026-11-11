import { createBrowserRouter } from 'react-router-dom'
import { LoginPage } from '@/features/auth/LoginPage'
import { ActivatePage } from '@/features/auth/ActivatePage'
import { RequireRole, RoleHomeRedirect } from '@/features/auth/RequireRole'
import { Placeholder } from '@/components/ui/Placeholder'
import { DirectorLayout } from './layouts/DirectorLayout'
import { TeacherLayout } from './layouts/TeacherLayout'
import { StudentLayout } from './layouts/StudentLayout'

// Cada Placeholder indica la tarjeta de Trello que lo reemplaza.
export const router = createBrowserRouter([
  { path: '/', element: <RoleHomeRedirect /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/activar', element: <ActivatePage /> },
  {
    path: '/director',
    element: (
      <RequireRole roles={['master']}>
        <DirectorLayout />
      </RequireRole>
    ),
    children: [
      { index: true, element: <Placeholder title="Resumen" card="7.1" /> },
      { path: 'estudiantes', element: <Placeholder title="Estudiantes" card="3.1" /> },
      { path: 'grupos', element: <Placeholder title="Grupos y profesores" card="3.2 / 3.3" /> },
      { path: 'planificacion', element: <Placeholder title="Planificación semanal" card="5.1" /> },
      { path: 'pagos', element: <Placeholder title="Pagos" card="3.4" /> },
      { path: 'curriculo', element: <Placeholder title="Currículo A1–B2" card="4.1" /> },
      { path: 'reportes', element: <Placeholder title="Reportes" card="7.2" /> },
    ],
  },
  {
    path: '/profesor',
    element: (
      <RequireRole roles={['teacher']}>
        <TeacherLayout />
      </RequireRole>
    ),
    children: [{ index: true, element: <Placeholder title="Mis clases de esta semana" card="5.3" /> }],
  },
  {
    path: '/estudiante',
    element: (
      <RequireRole roles={['student']}>
        <StudentLayout />
      </RequireRole>
    ),
    children: [
      { index: true, element: <Placeholder title="Inicio" card="6.3" /> },
      { path: 'progreso', element: <Placeholder title="Mi progreso" card="6.3" /> },
      { path: 'perfil', element: <Placeholder title="Perfil" card="6.3" /> },
    ],
  },
  { path: '*', element: <RoleHomeRedirect /> },
])
