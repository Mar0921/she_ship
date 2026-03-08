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
import { Heart, User, Briefcase, Check, ChevronRight, ChevronLeft, MapPin } from 'lucide-react';

type UserType = 'usuario' | 'profesional' | null;

export default function SignupPage() {
  return (
    <Layout showFooter={false}>
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-4 bg-gradient-to-b from-whatsapp-50 to-white">
        <SignupFlow />
      </div>
    </Layout>
  );
}

function SignupFlow() {
  const [step, setStep] = useState<'type' | 'form' | 'user-onboarding' | 'professional-info' | 'success'>('type');
  const [userType, setUserType] = useState<UserType>(null);
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleTypeSelect = (type: UserType) => {
    setUserType(type);
    setStep('form');
  };

  const handleAccountCreated = (userEmail: string) => {
    setEmail(userEmail);
    if (userType === 'profesional') {
      setStep('professional-info');
    } else {
      setStep('user-onboarding');
    }
  };

  const handleUserOnboardingComplete = () => {
    // Redirect to profile page after onboarding
    navigate('/perfil');
  };

  const handleProfessionalInfoComplete = () => {
    // Redirect to professional dashboard after registration
    navigate('/dashboard-profesional');
  };

  if (step === 'type') {
    return <UserTypeSelection onSelect={handleTypeSelect} />;
  }

  if (step === 'form') {
    return (
      <SignupForm
        userType={userType!}
        onSuccess={handleAccountCreated}
        onBack={() => setStep('type')}
      />
    );
  }

  if (step === 'user-onboarding') {
    return (
      <UserOnboardingForm
        onSuccess={handleUserOnboardingComplete}
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

  return <SignupSuccess userType={userType!} email={email} />;
}

function UserTypeSelection({ onSelect }: { onSelect: (type: UserType) => void }) {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <img src="/logo.png" className="w-10 h-10 object-contain" />
          <span className="text-2xl font-bold text-gray-900">PurpleMatch</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Crear cuenta</h1>
        <p className="text-gray-600">Selecciona el tipo de cuenta que deseas crear</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Usuario Card */}
        <button
          onClick={() => onSelect('usuario')}
          className="group p-6 bg-white rounded-2xl border-2 border-gray-200 hover:border-whatsapp-500 hover:shadow-lg transition-all text-left"
        >
          <div className="w-14 h-14 bg-whatsapp-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-whatsapp-200 transition-colors">
            <User className="w-7 h-7 text-whatsapp-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Soy Usuaria</h3>
          <p className="text-gray-600 text-sm mb-4">
            Busco apoyo emocional, quiero conectar con profesionales de salud mental y participar en la comunidad.
          </p>
          <ul className="space-y-2">
            <li className="flex items-center gap-2 text-sm text-gray-600">
              <Check className="w-4 h-4 text-whatsapp-600" />
              Encuentra tu terapeuta ideal
            </li>
            <li className="flex items-center gap-2 text-sm text-gray-600">
              <Check className="w-4 h-4 text-whatsapp-600" />
              Diario emocional privado
            </li>
            <li className="flex items-center gap-2 text-sm text-gray-600">
              <Check className="w-4 h-4 text-whatsapp-600" />
              Comunidad de apoyo
            </li>
          </ul>
          <div className="mt-4 flex items-center text-whatsapp-600 font-medium">
            Continuar <ChevronRight className="w-4 h-4 ml-1" />
          </div>
        </button>

        {/* Profesional Card */}
        <button
          onClick={() => onSelect('profesional')}
          className="group p-6 bg-white rounded-2xl border-2 border-gray-200 hover:border-whatsapp-500 hover:shadow-lg transition-all text-left"
        >
          <div className="w-14 h-14 bg-whatsapp-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-whatsapp-200 transition-colors">
            <Briefcase className="w-7 h-7 text-whatsapp-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Soy Profesional</h3>
          <p className="text-gray-600 text-sm mb-4">
            Soy psicóloga, terapeuta o profesional de salud mental y quiero ofrecer mis servicios.
          </p>
          <ul className="space-y-2">
            <li className="flex items-center gap-2 text-sm text-gray-600">
              <Check className="w-4 h-4 text-whatsapp-600" />
              Perfil profesional verificado
            </li>
            <li className="flex items-center gap-2 text-sm text-gray-600">
              <Check className="w-4 h-4 text-whatsapp-600" />
              Gestiona tus citas
            </li>
            <li className="flex items-center gap-2 text-sm text-gray-600">
              <Check className="w-4 h-4 text-whatsapp-600" />
              Conecta con pacientes
            </li>
          </ul>
          <div className="mt-4 flex items-center text-whatsapp-600 font-medium">
            Continuar <ChevronRight className="w-4 h-4 ml-1" />
          </div>
        </button>
      </div>

      <p className="text-center text-sm text-gray-600 mt-8">
        ¿Ya tienes cuenta?{' '}
        <Link to="/login" className="text-whatsapp-600 hover:text-whatsapp-700 font-medium">
          Inicia sesion
        </Link>
      </p>
    </div>
  );
}

function SignupForm({
  userType,
  onSuccess,
  onBack
}: {
  userType: UserType;
  onSuccess: (email: string) => void;
  onBack: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get('email'));
    const password = String(formData.get('password'));
    const confirmPassword = String(formData.get('confirmPassword'));

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
      await registerUser({ email, password, handle: email.split('@')[0], role: userType === 'profesional' ? 'professional' : 'user' });
      // Explicitly login after signup to ensure session is established
      await loginWithPassword({ email, password });
      onSuccess(email);
    } catch (error) {
      toast.error((error as Error).message);
      setIsLoading(false);
    }
  }, [onSuccess]);

  return (
    <Card className="w-full max-w-md mx-auto bg-white border-0 shadow-xl relative">
      <CardHeader className="text-center pb-2">
        <button
          onClick={onBack}
          className="absolute left-4 top-4 p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center justify-center gap-2 mb-2">
          <img src="/logo.png" className="w-10 h-10 object-contain" />
        </div>
        <CardTitle className="text-xl text-gray-900">
          {userType === 'profesional' ? 'Registro Profesional' : 'Crear cuenta'}
        </CardTitle>
        <p className="text-sm text-gray-600 mt-1">
          {userType === 'profesional'
            ? 'Paso 1 de 2: Datos de acceso'
            : 'Paso 1 de 2: Datos de acceso'}
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
            <Label htmlFor="password" className="block mb-2 text-gray-700">
              Contraseña
            </Label>
            <Input
              type="password"
              name="password"
              id="password"
              placeholder="Minimo 8 caracteres"
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
                  Terminos y Condiciones
                </a>{' '}
                y la{' '}
                <a className="font-medium text-whatsapp-600 hover:underline" href="/privacy" target="_blank">
                  Politica de Privacidad
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
            Inicia sesion
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}

function UserOnboardingForm({ onSuccess }: { onSuccess: () => void }) {
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

    completeOnboardingMutation.mutate({
      displayName: String(formData.get('displayName')),
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
          Paso 2 de 2: Cuentanos sobre ti para personalizar tu experiencia
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
                placeholder="Como te gustaria que te llamemos"
                className="bg-gray-50 border-gray-200"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Puedes usar un seudonimo si lo prefieres
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
              Ocupacion
            </Label>
            <Input
              type="text"
              name="occupation"
              id="occupation"
              placeholder="Ej: Estudiante, Profesora, Autonoma..."
              className="bg-gray-50 border-gray-200"
            />
          </div>

          {/* Location */}
          <div className="space-y-4">
            <Label className="block text-gray-700">Ubicacion</Label>
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
                  placeholder="Comunidad Autonoma"
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
                  <option value="Mexico">Mexico</option>
                  <option value="Argentina">Argentina</option>
                  <option value="Colombia">Colombia</option>
                  <option value="Chile">Chile</option>
                  <option value="Peru">Peru</option>
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
                Identidad etnica/cultural (opcional)
              </Label>
              <Input
                type="text"
                name="ethnicity"
                id="ethnicity"
                placeholder="Ej: Latina, Gitana, Afrodescendiente..."
                className="bg-gray-50 border-gray-200"
              />
              <p className="text-xs text-gray-500 mt-1">
                Para conectarte con profesionales que comprendan tu contexto cultural
              </p>
            </div>
            <div>
              <Label htmlFor="languagePreference" className="block mb-2 text-gray-700">
                Idioma preferido
              </Label>
              <select
                name="languagePreference"
                id="languagePreference"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                defaultValue="Español"
              >
                <option value="Español">Español</option>
                <option value="Catalan">Catalan</option>
                <option value="Euskera">Euskera</option>
                <option value="Gallego">Gallego</option>
                <option value="Ingles">Ingles</option>
              </select>
            </div>
          </div>

          {/* Medical History */}
          <div>
            <Label htmlFor="medicalHistory" className="block mb-2 text-gray-700">
              Informacion relevante de salud mental (opcional)
            </Label>
            <textarea
              name="medicalHistory"
              id="medicalHistory"
              rows={3}
              placeholder="Puedes compartir cualquier diagnostico previo, medicacion actual, o informacion que consideres relevante para tu terapeuta..."
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:border-whatsapp-500 focus:ring-whatsapp-500 text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">
              Esta informacion es completamente privada y solo la veras tu y tu terapeuta
            </p>
          </div>

          <div className="bg-whatsapp-50 rounded-lg p-4">
            <p className="text-sm text-whatsapp-800">
              <strong>Tu privacidad es importante:</strong> Toda esta informacion es opcional y puedes
              elegir participar de forma anonima en la comunidad. Puedes cambiar estos datos en cualquier momento.
            </p>
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
    'Ansiedad', 'Depresion', 'Trauma', 'Relaciones',
    'Autoestima', 'Duelo', 'Estres laboral', 'Trastornos alimentarios',
    'Violencia de genero', 'Maternidad', 'LGBTQ+', 'Adicciones'
  ];

  const languages = ['Español', 'Catalan', 'Euskera', 'Gallego', 'Ingles', 'Frances'];

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

    if (selectedSpecialties.length === 0) {
      toast.error('Selecciona al menos una especialidad');
      setIsLoading(false);
      return;
    }

    registerProfessionalMutation.mutate({
      fullName: String(formData.get('fullName')),
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
        <CardTitle className="text-xl text-gray-900">Informacion Profesional</CardTitle>
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
                placeholder="Dra. Maria Garcia"
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
              Descripcion profesional
            </Label>
            <textarea
              name="description"
              id="description"
              rows={3}
              placeholder="Cuentanos sobre tu enfoque terapeutico y experiencia..."
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:border-whatsapp-500 focus:ring-whatsapp-500 text-sm"
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
                      ? 'bg-whatsapp-500 text-white'
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
                Modalidad de atencion *
              </Label>
              <select
                name="modality"
                id="modality"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:border-whatsapp-500 focus:ring-whatsapp-500 text-sm"
                required
              >
                <option value="online">Solo online</option>
                <option value="presential">Solo presencial</option>
                <option value="both">Online y presencial</option>
              </select>
            </div>
            <div>
              <Label htmlFor="location" className="block mb-2 text-gray-700">
                Ubicacion
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
                      ? 'bg-whatsapp-500 text-white'
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
            <Label className="block mb-3 text-gray-700">Tarifas por sesion (EUR)</Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Input
                  type="number"
                  name="priceMin"
                  placeholder="Precio minimo"
                  min="0"
                  className="bg-gray-50 border-gray-200"
                />
              </div>
              <div>
                <Input
                  type="number"
                  name="priceMax"
                  placeholder="Precio maximo"
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
                className="w-4 h-4 border-gray-300 rounded text-whatsapp-600 focus:ring-whatsapp-500"
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

          <div className="bg-whatsapp-50 rounded-lg p-4">
            <p className="text-sm text-whatsapp-800">
              <strong>Nota:</strong> Tu perfil sera revisado por nuestro equipo para verificacion.
              Mientras tanto, podras acceder a tu dashboard y configurar tu perfil.
            </p>
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

function SignupSuccess({ userType, email }: { userType: UserType; email: string }) {
  return (
    <Card className="w-full max-w-md mx-auto bg-white border-0 shadow-xl text-center">
      <CardHeader>
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-green-600" />
        </div>
        <CardTitle className="text-xl text-gray-900">
          ¡Cuenta creada con exito!
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-gray-600">
          Hemos enviado un correo de verificacion a <strong>{email}</strong>
        </p>

        {userType === 'profesional' && (
          <div className="bg-whatsapp-50 rounded-lg p-4 text-left">
            <p className="text-sm text-whatsapp-800">
              Tu perfil profesional ha sido enviado para verificacion.
              Te notificaremos por correo cuando este aprobado.
            </p>
          </div>
        )}

        <Link to="/login" className="block">
          <Button className="w-full bg-whatsapp-500 hover:bg-whatsapp-600 text-white">
            Iniciar sesion
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
