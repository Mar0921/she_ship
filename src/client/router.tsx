import { lazy } from 'react';
import { createBrowserRouter, RouteObject } from 'react-router-dom';

// All routes are now public (no authentication required)
const routes: RouteObject[] = [
  {
    path: '/',
    Component: lazy(() => import('./pages/LandingPage'))
  },
  {
    path: '/home',
    Component: lazy(() => import('./pages/HomePage'))
  },
  {
    path: '/signup',
    Component: lazy(() => import('./pages/SignupPage'))
  },
  {
    path: '/signup/usuario',
    Component: lazy(() => import('./pages/SignupUsuarioPage'))
  },
  {
    path: '/signup/profesional',
    Component: lazy(() => import('./pages/SignupProfesionalPage'))
  },
  {
    path: '/login',
    Component: lazy(() => import('./pages/LoginPage'))
  },
  {
    path: '/terapeutas',
    Component: lazy(() => import('./pages/TerapeutasPage'))
  },
  {
    path: '/comunidad',
    Component: lazy(() => import('./pages/ComunidadPage'))
  },
  {
    path: '/recursos',
    Component: lazy(() => import('./pages/RecursosPage'))
  },
  {
    path: '/perfil',
    Component: lazy(() => import('./pages/PerfilPage'))
  },
  {
    path: '/dashboard-profesional',
    Component: lazy(() => import('./pages/DashboardProfesionalPage'))
  },
  {
    path: '/admin',
    Component: lazy(() => import('./pages/AdminDashboardPage'))
  },
  {
    path: '/chat/:recipientId?',
    Component: lazy(() => import('./pages/ChatPage'))
  },
  {
    path: '/terms',
    Component: lazy(() => import('./pages/TermsPage'))
  },
  {
    path: '*',
    Component: lazy(() => import('./pages/NotFoundPage'))
  }
];

export const router = createBrowserRouter(routes);
