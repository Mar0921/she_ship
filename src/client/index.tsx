import { Suspense, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { toast, Toaster } from 'react-hot-toast';
import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { router } from './router';
import { AuthProvider } from './lib/auth';
import './index.css';
import LoadingSpinner from './components/LoadingSpinner';

const queryClient = new QueryClient();

function App() {
  return (
    <Suspense fallback={<LoadingSpinner fullScreen />}>
      <AuthProvider>
        <Toaster position="top-right" />
        <RouterProvider router={router} />
      </AuthProvider>
    </Suspense>
  );
}

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </StrictMode>
  );
}
