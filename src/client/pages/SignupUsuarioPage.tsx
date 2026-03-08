import React, { useCallback, useState } from 'react';
import { registerUser, loginWithPassword } from '@/client/lib/auth';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/client/components/ui/Button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/client/components/ui/Card';
import { Input } from '@/client/components/ui/Input';
import { Label } from '@/client/components/ui/Label';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '@/client/components/Layout';
import { toast } from 'react-hot-toast';
import { Heart, User, Check, MapPin } from 'lucide-react';

export default function SignupUsuarioPage() {
  return (
    <Layout showFooter={false}>
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-4 bg-gradient-to-b from-whatsapp-50 to-white">
        <UsuarioSignupFlow />
      </div>
    </Layout>
  );
}

function UsuarioSignupFlow() {
  const [step, setStep] = useState<'form' | 'onboarding' | 'success'>('form');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleAccountCreated = (userEmail: string) => {
    setEmail(userEmail);
    setStep('onboarding');
  };

  const handleOnboardingComplete = () => {
    navigate('/perfil');
  };

  if (step === 'form') {
    return (
      <UsuarioSignupForm
        onSuccess={handleAccountCreated}
      />
    );
  }

  if (step === 'onboarding') {
    return (
      <UsuarioOnboardingForm
        onSuccess={handleOnboardingComplete}
      />
    );
  }

  return <UsuarioSignupSuccess email={email} />;
}

function UsuarioSignupForm({
  onSuccess
}: {
  onSuccess: (email: string) => void;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get('email'));
    const password = String(formData.get('password'));
    const confirmPassword = String(formData.get('confirmPassword'));
    const nombre = String(formData.get('nombre'));

    if (password !== confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      setIsLoading(false);
      return;
    }

    if (password.length < 8) {
      toast.error('La contraseña debe tener al menos 8 caracteres');
      setIsLoading(false);
      return;
    }

    try {
      await registerUser({ email, password, handle: email.split('@')[0], role: 'user' });
      // Explicitly login after signup to ensure session is established
      await loginWithPassword({ email, password });
      // Store the name temporarily for onboarding
      sessionStorage.setItem('signup_nombre', nombre);
      onSuccess(email);
    } catch (error) {
      toast.error((error as Error).message);
      setIsLoading(false);
    }
  }, [onSuccess]);

  return (
    <Card className="w-full max-w-md mx-auto bg-white border-0 shadow-xl relative">
      <CardHeader className="text-center pb-2">
        <div className="flex items-center justify-center gap-2 mb-2">
          <img src="/logo.png" className="w-10 h-10 object-contain" />
        </div>
        <CardTitle className="text-xl text-gray-900">
          Registro de Usuaria
        </CardTitle>
        <p className="text-sm text-gray-600 mt-1">
          Paso 1 de 2: Datos de acceso
        </p>
      </CardHeader>

      <CardContent className="space-y-6 pt-4">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="nombre" className="block mb-2 text-gray-700">
              Nombre o apodo
            </Label>
            <Input
              type="text"
              name="nombre"
              id="nombre"
              placeholder="Como te gustaria que te llamemos"
              className="bg-gray-50 border-gray-200 focus:border-whatsapp-500 focus:ring-whatsapp-500"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Puedes usar un seudónimo si lo prefieres
            </p>
          </div>

          <div>
            <Label htmlFor="email" className="block mb-2 text-gray-700">
              Correo electrónico
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
            <Label htmlFor="password" className="block mb-2 text-gray-700">
              Contraseña
            </Label>
            <Input
              type="password"
              name="password"
              id="password"
              placeholder="Mínimo 8 caracteres"
              className="bg-gray-50 border-gray-200 focus:border-whatsapp-500 focus:ring-whatsapp-500"
              required
            />
          </div>

          <div>
            <Label htmlFor="confirm-password" className="block mb-2 text-gray-700">
              Confirmar contraseña
            </Label>
            <Input
              type="password"
              name="confirmPassword"
              id="confirm-password"
              placeholder="Repite tu contraseña"
              className="bg-gray-50 border-gray-200 focus:border-whatsapp-500 focus:ring-whatsapp-500"
              required
            />
          </div>

          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="consent-terms"
                type="checkbox"
                name="consent-terms"
                className="w-4 h-4 border-gray-300 rounded bg-gray-50 text-whatsapp-600 focus:ring-whatsapp-500"
                required
              />
            </div>
            <div className="ml-3 text-sm">
              <Label htmlFor="consent-terms" className="text-gray-600">
                Acepto los{' '}
                <a className="font-medium text-whatsapp-600 hover:underline" href="/terms" target="_blank">
                  Términos y Condiciones
                </a>{' '}
                y la{' '}
                <a className="font-medium text-whatsapp-600 hover:underline" href="/privacy" target="_blank">
                  Política de Privacidad
                </a>
              </Label>
            </div>
          </div>

          <Button
            className="w-full bg-whatsapp-500 hover:bg-whatsapp-600 text-white"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Creando cuenta...' : 'Continuar'}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="justify-center pt-0">
        <p className="text-center text-sm text-gray-600">
          ¿Ya tienes cuenta?{' '}
          <Link
            to="/login"
            className="text-whatsapp-600 hover:text-whatsapp-700 font-medium"
          >
            Inicia sesión
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}

function UsuarioOnboardingForm({ onSuccess }: { onSuccess: () => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isRural, setIsRural] = useState(false);

  const completeOnboardingMutation = useMutation({
    mutationFn: async (data: {
      displayName: string;
      age?: number;
      occupation?: string;
      locationCity?: string;
      locationRegion?: string;
      locationCountry?: string;
      isRural: boolean;
      ethnicity?: string;
      languagePreference?: string;
      medicalHistory?: string;
    }) => {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          display_name: data.displayName,
          age: data.age,
          occupation: data.occupation,
          location_city: data.locationCity,
          location_region: data.locationRegion,
          location_country: data.locationCountry,
          is_rural: data.isRural,
          ethnicity: data.ethnicity,
          language_preference: data.languagePreference,
          medical_history: data.medicalHistory
        })
      });
      if (!response.ok) throw new Error('Error al completar onboarding');
      return response.json();
    },
    onSuccess: () => {
      toast.success('¡Bienvenida a PurpleMatch!');
      onSuccess();
    },
    onError: (error: Error) => {
      toast.error(error.message);
      setIsLoading(false);
    }
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const nombre = sessionStorage.getItem('signup_nombre') || '';

    completeOnboardingMutation.mutate({
      displayName: nombre || String(formData.get('displayName')),
      age: parseInt(String(formData.get('age'))) || undefined,
      occupation: String(formData.get('occupation')) || undefined,
      locationCity: String(formData.get('locationCity')) || undefined,
      locationRegion: String(formData.get('locationRegion')) || undefined,
      locationCountry: String(formData.get('locationCountry')) || 'España',
      isRural: isRural,
      ethnicity: String(formData.get('ethnicity')) || undefined,
      languagePreference: String(formData.get('languagePreference')) || 'Español',
      medicalHistory: String(formData.get('medicalHistory')) || undefined,
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto bg-white border-0 shadow-xl">
      <CardHeader className="text-center pb-2">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
        </div>
        <CardTitle className="text-xl text-gray-900">Completa tu perfil</CardTitle>
        <p className="text-sm text-gray-600 mt-1">
          Paso 2 de 2: Cuéntanos sobre ti para personalizar tu experiencia
        </p>
      </CardHeader>

      <CardContent className="pt-4">
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Basic Info */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="displayName" className="block mb-2 text-gray-700">
                Nombre o apodo *
              </Label>
              <Input
                type="text"
                name="displayName"
                id="displayName"
                placeholder="Cómo te gustaría que te llamemos"
                className="bg-gray-50 border-gray-200"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Puedes usar un seudónimo si lo prefieres
              </p>
            </div>
            <div>
              <Label htmlFor="age" className="block mb-2 text-gray-700">
                Edad
              </Label>
              <Input
                type="number"
                name="age"
                id="age"
                min="13"
                max="120"
                placeholder="Tu edad"
                className="bg-gray-50 border-gray-200"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="occupation" className="block mb-2 text-gray-700">
              Ocupación
            </Label>
            <Input
              type="text"
              name="occupation"
              id="occupation"
              placeholder="Ej: Estudiante, Profesora, Autónoma..."
              className="bg-gray-50 border-gray-200"
            />
          </div>

          {/* Location */}
          <div className="space-y-4">
            <Label className="block text-gray-700">Ubicación</Label>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Input
                  type="text"
                  name="locationCity"
                  placeholder="Ciudad"
                  className="bg-gray-50 border-gray-200"
                />
              </div>
              <div>
                <Input
                  type="text"
                  name="locationRegion"
                  placeholder="Comunidad Autónoma"
                  className="bg-gray-50 border-gray-200"
                />
              </div>
              <div>
                <select
                  name="locationCountry"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                  defaultValue="España"
                >
                  <option value="España">España</option>
                  <option value="México">México</option>
                  <option value="Argentina">Argentina</option>
                  <option value="Colombia">Colombia</option>
                  <option value="Chile">Chile</option>
                  <option value="Perú">Perú</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsRural(!isRural)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                  isRural
                    ? 'bg-whatsapp-100 border-whatsapp-300 text-whatsapp-700'
                    : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <MapPin className="w-4 h-4" />
                Vivo en zona rural
              </button>
              <p className="text-xs text-gray-500">
                Esto nos ayuda a conectarte con profesionales que entienden tu contexto
              </p>
            </div>
          </div>

          {/* Cultural Context */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="ethnicity" className="block mb-2 text-gray-700">
                Identidad étnica/cultural (opcional)
              </Label>
              <Input
                type="text"
                name="ethnicity"
                id="ethnicity"
                placeholder="Ej: Latina, Gitana, Afrodescendiente..."
                className="bg-gray-50 border-gray-200"
              />
            </div>
            <div>
              <Label htmlFor="languagePreference" className="block mb-2 text-gray-700">
                Idioma de preferencia
              </Label>
              <select
                name="languagePreference"
                id="languagePreference"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                defaultValue="Español"
              >
                <option value="Español">Español</option>
                <option value="Catalán">Catalán</option>
                <option value="Euskera">Euskera</option>
                <option value="Gallego">Gallego</option>
                <option value="Inglés">Inglés</option>
              </select>
            </div>
          </div>

          {/* Additional Info */}
          <div>
            <Label htmlFor="medicalHistory" className="block mb-2 text-gray-700">
              Contexto relevante (opcional)
            </Label>
            <textarea
              name="medicalHistory"
              id="medicalHistory"
              rows={3}
              placeholder="Cualquier información que consideres relevante para tu proceso..."
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:border-whatsapp-500 focus:ring-whatsapp-500 text-sm"
            />
          </div>

          <Button
            className="w-full bg-whatsapp-500 hover:bg-whatsapp-600 text-white"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Guardando...' : 'Completar registro'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function UsuarioSignupSuccess({ email }: { email: string }) {
  return (
    <Card className="w-full max-w-md mx-auto bg-white border-0 shadow-xl text-center">
      <CardHeader>
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-green-600" />
        </div>
        <CardTitle className="text-xl text-gray-900">
          ¡Cuenta creada con éxito!
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-gray-600">
          Hemos enviado un correo de verificación a <strong>{email}</strong>
        </p>

        <Link to="/login" className="block">
          <Button className="w-full bg-whatsapp-500 hover:bg-whatsapp-600 text-white">
            Iniciar sesión
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
