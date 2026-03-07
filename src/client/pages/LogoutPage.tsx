import { useEffect } from 'react';

export default function LogoutPage() {
  useEffect(() => {
    // Clear all auth data
    localStorage.removeItem('token');
    
    // Redirect to landing page
    window.location.href = '/';
  }, []);

  return null;
}

