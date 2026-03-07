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
import { Heart, Briefcase, Check } from 'lucide-react';

export default function SignupProfesionalPage() {
  return (
    <Layout showFooter={false}>
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-4 bg-gradient-to-b from-purple-50 to-white">
        <ProfesionalSignupFlow />
      </div>
    </Layout>
  );
}

function ProfesionalSignupFlow() {
  const [step, setStep] = useState<'form' | 'professional-info' | 'success'>('form');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleAccountCreated = (userEmail: string) => {
    setEmail(userEmail);
    setStep('professional-info');
  };

  const handleProfessionalInfoComplete = () => {
    navigate('/dashboard-profesional');
  };

  if (step === 'form') {
    return (
      <ProfesionalSignupForm
        onSuccess={handleAccountCreated}
      />
    );
  }

  if (step === 'professional-info') {
    return (
      <ProfessionalInfoForm
        onSuccess={handleProfessionalInfoComplete}
      />
    );
  }

  return <ProfesionalSignupSuccess email={email} />;
}

function ProfesionalSignupForm({
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
      await registerUser({ email, password, handle: email.split('@')[0], role: 'professional' });
      // Explicitly login after signup to ensure session is established
      await loginWithPassword({ email, password });
      // Store the name temporarily for professional info
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
          <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
            <Heart className="w-5 h-5 text-white" />
          </div>
        </div>
        <CardTitle className="text-xl text-gray-900">
          Registro de Profesional
        </CardTitle>
        <p className="text-sm text-gray-600 mt-1">
          Paso 1 de 2: Datos de acceso
        </p>
      </CardHeader>

      <CardContent className="space-y-6 pt-4">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="nombre" className="block mb-2 text-gray-700">
              Nombre completo
            </Label>
            <Input
              type="text"
              name="nombre"
              id="nombre"
              placeholder="Dra. María García"
              className="bg-gray-50 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
              required
            />
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
              className="bg-gray-50 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
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
              className="bg-gray-50 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
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
              className="bg-gray-50 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
              required
            />
          </div>

          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="consent-terms"
                type="checkbox"
                name="consent-terms"
                className="w-4 h-4 border-gray-300 rounded bg-gray-50 text-purple-600 focus:ring-purple-500"
                required
              />
            </div>
            <div className="ml-3 text-sm">
              <Label htmlFor="consent-terms" className="text-gray-600">
                Acepto los{' '}
                <a className="font-medium text-purple-600 hover:underline" href="/terms" target="_blank">
                  Términos y Condiciones
                </a>{' '}
                y la{' '}
                <a className="font-medium text-purple-600 hover:underline" href="/privacy" target="_blank">
                  Política de Privacidad
                </a>
              </Label>
            </div>
          </div>

          <Button
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
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
            className="text-purple-600 hover:text-purple-700 font-medium"
          >
            Inicia sesión
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}

function ProfessionalInfoForm({ onSuccess }: { onSuccess: () => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(['Español']);

  const registerProfessionalMutation = useMutation({
    mutationFn: async (data: {
      fullName: string;
      description: string;
      specialties: string[];
      modality: string;
      languages: string[];
      experienceYears: number;
      priceMin?: number;
      priceMax?: number;
      isVolunteer: boolean;
      location: string;
      linkedinUrl?: string;
    }) => {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/profesional/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          full_name: data.fullName,
          description: data.description,
          specialties: data.specialties,
          modality: data.modality,
          languages: data.languages,
          experience_years: data.experienceYears,
          price_min: data.priceMin,
          price_max: data.priceMax,
          is_volunteer: data.isVolunteer,
          location: data.location,
          linkedin_url: data.linkedinUrl
        })
      });
      if (!response.ok) throw new Error('Error al registrar profesional');
      return response.json();
    },
    onSuccess: () => {
      toast.success('¡Registro completado! Bienvenida a PurpleMatch');
      onSuccess();
    },
    onError: (error: Error) => {
      toast.error(error.message);
      setIsLoading(false);
    }
  });

  const specialties = [
    'Ansiedad', 'Depresión', 'Trauma', 'Relaciones',
    'Autoestima', 'Duelo', 'Estrés laboral', 'Trastornos alimentarios',
    'Violencia de género', 'Maternidad', 'LGBTQ+', 'Adicciones'
  ];

  const languages = ['Español', 'Catalán', 'Euskera', 'Gallego', 'Inglés', 'Francés'];

  const toggleSpecialty = (specialty: string) => {
    setSelectedSpecialties(prev =>
      prev.includes(specialty)
        ? prev.filter(s => s !== specialty)
        : [...prev, specialty]
    );
  };

  const toggleLanguage = (language: string) => {
    setSelectedLanguages(prev =>
      prev.includes(language)
        ? prev.filter(l => l !== language)
        : [...prev, language]
    );
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const nombre = sessionStorage.getItem('signup_nombre') || '';

    if (selectedSpecialties.length === 0) {
      toast.error('Selecciona al menos una especialidad');
      setIsLoading(false);
      return;
    }

    registerProfessionalMutation.mutate({
      fullName: nombre || String(formData.get('fullName')),
      description: String(formData.get('description')),
      specialties: selectedSpecialties,
      modality: String(formData.get('modality')),
      languages: selectedLanguages,
      experienceYears: parseInt(String(formData.get('experienceYears'))) || 0,
      priceMin: parseInt(String(formData.get('priceMin'))) || undefined,
      priceMax: parseInt(String(formData.get('priceMax'))) || undefined,
      isVolunteer: formData.get('isVolunteer') === 'on',
      location: String(formData.get('location')),
      linkedinUrl: String(formData.get('linkedinUrl')) || undefined,
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto bg-white border-0 shadow-xl">
      <CardHeader className="text-center pb-2">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
        </div>
        <CardTitle className="text-xl text-gray-900">Información Profesional</CardTitle>
        <p className="text-sm text-gray-600 mt-1">
          Paso 2 de 2: Completa tu perfil profesional
        </p>
      </CardHeader>

      <CardContent className="pt-4">
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Basic Info */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fullName" className="block mb-2 text-gray-700">
                Nombre completo *
              </Label>
              <Input
                type="text"
                name="fullName"
                id="fullName"
                placeholder="Dra. María García"
                className="bg-gray-50 border-gray-200"
                required
              />
            </div>
            <div>
              <Label htmlFor="experienceYears" className="block mb-2 text-gray-700">
                Años de experiencia *
              </Label>
              <Input
                type="number"
                name="experienceYears"
                id="experienceYears"
                min="0"
                placeholder="5"
                className="bg-gray-50 border-gray-200"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description" className="block mb-2 text-gray-700">
              Descripción profesional
            </Label>
            <textarea
              name="description"
              id="description"
              rows={3}
              placeholder="Cuéntanos sobre tu enfoque terapéutico y experiencia..."
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:border-purple-500 focus:ring-purple-500 text-sm"
            />
          </div>

          {/* Specialties */}
          <div>
            <Label className="block mb-3 text-gray-700">Especialidades *</Label>
            <div className="flex flex-wrap gap-2">
              {specialties.map((specialty) => (
                <button
                  key={specialty}
                  type="button"
                  onClick={() => toggleSpecialty(specialty)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    selectedSpecialties.includes(specialty)
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {specialty}
                </button>
              ))}
            </div>
          </div>

          {/* Modality & Location */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="modality" className="block mb-2 text-gray-700">
                Modalidad de atención *
              </Label>
              <select
                name="modality"
                id="modality"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:border-purple-500 focus:ring-purple-500 text-sm"
                required
              >
                <option value="online">Solo online</option>
                <option value="presential">Solo presencial</option>
                <option value="both">Online y presencial</option>
              </select>
            </div>
            <div>
              <Label htmlFor="location" className="block mb-2 text-gray-700">
                Ubicación
              </Label>
              <Input
                type="text"
                name="location"
                id="location"
                placeholder="Madrid, España"
                className="bg-gray-50 border-gray-200"
              />
            </div>
          </div>

          {/* Languages */}
          <div>
            <Label className="block mb-3 text-gray-700">Idiomas</Label>
            <div className="flex flex-wrap gap-2">
              {languages.map((language) => (
                <button
                  key={language}
                  type="button"
                  onClick={() => toggleLanguage(language)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    selectedLanguages.includes(language)
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {language}
                </button>
              ))}
            </div>
          </div>

          {/* Pricing */}
          <div>
            <Label className="block mb-3 text-gray-700">Tarifas por sesión (EUR)</Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Input
                  type="number"
                  name="priceMin"
                  placeholder="Precio mínimo"
                  min="0"
                  className="bg-gray-50 border-gray-200"
                />
              </div>
              <div>
                <Input
                  type="number"
                  name="priceMax"
                  placeholder="Precio máximo"
                  min="0"
                  className="bg-gray-50 border-gray-200"
                />
              </div>
            </div>
            <div className="mt-3 flex items-center">
              <input
                id="isVolunteer"
                type="checkbox"
                name="isVolunteer"
                className="w-4 h-4 border-gray-300 rounded text-purple-600 focus:ring-purple-500"
              />
              <Label htmlFor="isVolunteer" className="ml-2 text-sm text-gray-600">
                Ofrezco sesiones gratuitas o de bajo costo
              </Label>
            </div>
          </div>

          {/* LinkedIn */}
          <div>
            <Label htmlFor="linkedinUrl" className="block mb-2 text-gray-700">
              LinkedIn (opcional)
            </Label>
            <Input
              type="url"
              name="linkedinUrl"
              id="linkedinUrl"
              placeholder="https://linkedin.com/in/tu-perfil"
              className="bg-gray-50 border-gray-200"
            />
          </div>

          {/* Professional License */}
          <div>
            <Label htmlFor="professionalLicense" className="block mb-2 text-gray-700">
              Número de colegiación/Tarjeta profesional (opcional)
            </Label>
            <Input
              type="text"
              name="professionalLicense"
              id="professionalLicense"
              placeholder="Número de colegiación o licencia profesional"
              className="bg-gray-50 border-gray-200"
            />
          </div>

          <div className="bg-purple-50 rounded-lg p-4">
            <p className="text-sm text-purple-800">
              <strong>Nota:</strong> Tu perfil será revisado por nuestro equipo para verificación.
              Mientras tanto, podrás acceder a tu dashboard y configurar tu perfil.
            </p>
          </div>

          <Button
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
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

function ProfesionalSignupSuccess({ email }: { email: string }) {
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

        <div className="bg-purple-50 rounded-lg p-4 text-left">
          <p className="text-sm purple-800">
            Tu perfil profesional ha sido enviado para verificación.
            Te notificaremos por correo cuando esté aprobado.
          </p>
        </div>

        <Link to="/login" className="block">
          <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
            Iniciar sesión
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
