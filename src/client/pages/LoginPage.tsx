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
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-4 bg-gradient-to-b from-whatsapp-50 to-white">
        <LoginForm />
      </div>
    </Layout>
  );
}

function LoginForm() {
  const navigate = useNavigate();
  const { user, loading } = useSession();
  const { login } = useAuth();

  // If already logged in, redirect based on role (only when not loading)
  useEffect(() => {
    if (!loading && user) {
      // Redirect based on user role
      if (user.role === 'professional') {
        navigate('/dashboard-profesional');
      } else if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/home');
      }
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
  }, [navigate, login]);

  return (
    <Card className="w-full max-w-md mx-auto bg-white border-0 shadow-xl">
      <CardHeader className="text-center pb-2">
        <div className="flex items-center justify-center gap-2 mb-4">
          <img src="/logo.png" className="w-10 h-10 object-contain" />
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
              className="bg-gray-50 border-gray-200 focus:border-whatsapp-500 focus:ring-whatsapp-500"
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
                className="text-sm text-whatsapp-600 hover:text-whatsapp-700"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
            <Input
              type="password"
              name="password"
              id="password"
              placeholder="Tu contraseña"
              className="bg-gray-50 border-gray-200 focus:border-whatsapp-500 focus:ring-whatsapp-500"
              required
            />
          </div>

          <Button
            className="w-full bg-whatsapp-500 hover:bg-whatsapp-600 text-white"
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
            className="text-whatsapp-600 hover:text-whatsapp-700 font-medium"
          >
            Crear cuenta
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
