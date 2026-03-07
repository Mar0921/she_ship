import React, { useCallback } from 'react';
import { loginWithPassword, useSession, useAuth } from '@/client/lib/auth';
import { Button } from '@/client/components/ui/Button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/client/components/ui/Card';
import { Input } from '@/client/components/ui/Input';
import { Label } from '@/client/components/ui/Label';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '@/client/components/Layout';
import { Heart } from 'lucide-react';
import { useEffect } from 'react';

export default function LoginPage() {
  return (
    <Layout showFooter={false}>
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-4 bg-gradient-to-b from-purple-50 to-white">
        <LoginForm />
      </div>
    </Layout>
  );
}

function LoginForm() {
  const navigate = useNavigate();
  const { user, loading } = useSession();
  const { login } = useAuth();

  // If already logged in, redirect to home (only when not loading)
  useEffect(() => {
    if (!loading && user) {
      navigate('/home');
    }
  }, [user, loading, navigate]);

  // Show nothing while checking auth state
  if (loading) {
    return null;
  }

  const handleSubmit = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    // Login using the auth context (this sets the user in context)
    await login(email, password);
    
    // After successful login, redirect based on user role
    // We need to fetch the user info to get the role
    const token = localStorage.getItem('token');
    const response = await fetch('/api/auth/me', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const userData = await response.json();
    
    if (userData.role === 'professional') {
      navigate('/dashboard-profesional');
    } else if (userData.role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/home');
    }
  }, [navigate, login]);

  return (
    <Card className="w-full max-w-md mx-auto bg-white border-0 shadow-xl">
      <CardHeader className="text-center pb-2">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-gray-900">PurpleMatch</span>
        </div>
        <CardTitle className="text-xl text-gray-900">
          Bienvenida de vuelta
        </CardTitle>
        <p className="text-sm text-gray-600 mt-1">
          Inicia sesion para acceder a tu cuenta
        </p>
      </CardHeader>

      <CardContent className="space-y-6 pt-4">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="email" className="block mb-2 text-gray-700">
              Correo electronico
            </Label>
            <Input
              type="email"
              name="email"
              id="email"
              placeholder="tu@email.com"
              className="bg-gray-50 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="password" className="text-gray-700">
                Contraseña
              </Label>
              <Link
                to="/forgot-password"
                className="text-sm text-purple-600 hover:text-purple-700"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
            <Input
              type="password"
              name="password"
              id="password"
              placeholder="Tu contraseña"
              className="bg-gray-50 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
              required
            />
          </div>

          <Button
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            type="submit"
          >
            Iniciar sesion
          </Button>
        </form>
      </CardContent>

      <CardFooter className="justify-center pt-0">
        <p className="text-center text-sm text-gray-600">
          ¿No tienes cuenta?{' '}
          <Link
            to="/signup"
            className="text-purple-600 hover:text-purple-700 font-medium"
          >
            Crear cuenta
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
