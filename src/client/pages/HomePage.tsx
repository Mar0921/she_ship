import { Link, useNavigate } from 'react-router-dom';
import { useSession, logout } from '@/client/lib/auth';
import { 
  Heart,
  Users,
  BookOpen,
  Video,
  LogOut,
  User,
  Briefcase,
  Calendar,
  MessageCircle,
  Settings,
  BarChart3
} from 'lucide-react';
import { Button } from '@/client/components/ui/Button';
import Layout from '@/client/components/Layout';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

interface UserRole {
  role: 'user' | 'professional';
}

interface ProfessionalProfile {
  fullName: string;
  description: string;
  specialties: string[];
  modality: string;
  languages: string[];
  experienceYears: number;
  priceMin?: number;
  priceMax?: number;
  isVerified: boolean;
  availabilityStatus: string;
}

export default function HomePage() {
  const { user, loading: authLoading } = useSession();
  const navigate = useNavigate();
  const [isProfessional, setIsProfessional] = useState<boolean | null>(null);

  // Show loading spinner while auth is loading
  if (authLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700"></div>
        </div>
      </Layout>
    );
  }

  // Redirect to login if not authenticated (only after auth loading is complete)
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  // Query to check user role
  const { data: roleData, isLoading: isRoleLoading, error: roleError } = useQuery<UserRole>({
    queryKey: ['userRole'],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/user/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) return { role: 'user' };
      const data = await response.json();
      return { role: data.role || 'user' };
    },
    enabled: !!user
  });

  // Query to get professional profile data (only if user is a professional)
  const { data: professionalData } = useQuery<ProfessionalProfile | null>({
    queryKey: ['professionalProfile'],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/profesional/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) return null;
      return response.json();
    },
    enabled: !!user && roleData?.role === 'professional'
  });

  useEffect(() => {
    // Only set isProfessional when we have a definitive answer from the query
    if (isRoleLoading) {
      return; // Don't change state while loading
    }
    
    if (roleError) {
      // If there's an error, treat as non-professional
      console.error('Error fetching user role:', roleError);
      setIsProfessional(false);
      return;
    }
    
    // Check user role
    if (roleData && roleData.role === 'professional') {
      setIsProfessional(true);
    } else {
      setIsProfessional(false);
    }
  }, [roleData, isRoleLoading, roleError]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // Show user view if logged in, otherwise show nothing (will redirect)
  if (!user) {
    return null;
  }

  // While checking professional status, show loading
  if (isProfessional === null) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-whatsapp-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {isProfessional ? (
        <ProfessionalHomeView user={user} professionalData={professionalData} onLogout={handleLogout} />
      ) : (
        <UsuarioHomeView user={user} onLogout={handleLogout} />
      )}
    </Layout>
  );
}

function UsuarioHomeView({ 
  user, 
  onLogout 
}: { 
  user: { id: number; email?: string }; 
  onLogout: () => void 
}) {
  const features = [
    {
      icon: Video,
      title: 'Encuentra tu Terapeuta',
      description: 'Conecta con profesionales verificados que entienden tu contexto y necesidades.',
      link: '/terapeutas',
      color: 'bg-whatsapp-100 text-whatsapp-600'
    },
    {
      icon: Users,
      title: 'Comunidad de Apoyo',
      description: 'Comparte experiencias y encuentra apoyo en un espacio seguro y moderado.',
      link: '/comunidad',
      color: 'bg-pink-100 text-pink-600'
    },
    {
      icon: Heart,
      title: 'Mi Diario',
      description: 'Registra tu proceso emocional y haz seguimiento de tu progreso terapéutico.',
      link: '/perfil',
      color: 'bg-rose-100 text-rose-600'
    },
    {
      icon: BookOpen,
      title: 'Recursos y Guías',
      description: 'Accede a contenido educativo y líneas de emergencia cuando lo necesites.',
      link: '/recursos',
      color: 'bg-violet-100 text-violet-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-whatsapp-50 to-white">
      {/* Header with user info only (no buttons - buttons are in main Navigation) */}
      <header className="bg-white shadow-sm border-b border-whatsapp-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-whatsapp-100 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-whatsapp-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Bienvenida</p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            ¿En qué podemos ayudarte hoy?
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explora todas las herramientas que PurpleMatch tiene para ti.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features.map((feature) => (
            <Link
              key={feature.title}
              to={feature.link}
              className="group p-6 bg-white rounded-2xl hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-whatsapp-200"
            >
              <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-purple-600 rounded-2xl p-6 text-white">
            <Calendar className="w-8 h-8 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Mis Citas</h3>
            <p className="text-purple-100 mb-4">Gestiona tus citas con profesionales</p>
            <Link to="/chat">
              <Button variant="whatsapp" className="w-full">
                Ver Citas
              </Button>
            </Link>
          </div>
          
          <div className="bg-pink-500 rounded-2xl p-6 text-white">
            <MessageCircle className="w-8 h-8 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Mensajes</h3>
            <p className="text-pink-100 mb-4">Chatea con tu terapeuta</p>
            <Link to="/chat">
              <Button variant="whatsapp" className="w-full">
                Abrir Chat
              </Button>
            </Link>
          </div>
          
          <div className="bg-violet-500 rounded-2xl p-6 text-white">
            <Heart className="w-8 h-8 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Mi Progreso</h3>
            <p className="text-violet-100 mb-4">Revisa tu diario emocional</p>
            <Link to="/perfil">
              <Button variant="whatsapp" className="w-full">
                Ver Progreso
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

function ProfessionalHomeView({ 
  user, 
  professionalData,
  onLogout 
}: { 
  user: { id: number; email?: string }; 
  professionalData: ProfessionalProfile | null | undefined;
  onLogout: () => void 
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-whatsapp-50 to-white">
      {/* Header with user info and logout */}
      <header className="bg-white shadow-sm border-b border-whatsapp-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-whatsapp-100 rounded-full flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-whatsapp-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Panel Profesional</p>
                <p className="text-sm text-gray-500">{professionalData?.fullName || user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/dashboard-profesional">
                <Button variant="ghost" size="sm">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <Link to="/perfil">
                <Button variant="ghost" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  Mi Perfil
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={onLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Bienvenida, {professionalData?.fullName || 'Profesional'}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Gestiona tu práctica profesional y conecta con nuevas pacientes.
          </p>
        </div>

        {/* Professional Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-whatsapp-100 rounded-xl flex items-center justify-center mb-4">
              <Calendar className="w-6 h-6 text-whatsapp-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Citas Programadas</h3>
            <p className="text-gray-600 text-sm mb-4">Ver y gestionar tus citas</p>
            <Link to="/dashboard-profesional">
              <Button className="w-full">Ver Citas</Button>
            </Link>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mb-4">
              <MessageCircle className="w-6 h-6 text-pink-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Mensajes</h3>
            <p className="text-gray-600 text-sm mb-4">Chatea con tus pacientes</p>
            <Link to="/chat">
              <Button className="w-full">Abrir Chat</Button>
            </Link>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center mb-4">
              <User className="w-6 h-6 text-violet-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Pacientes</h3>
            <p className="text-gray-600 text-sm mb-4">Ver tu lista de pacientes</p>
            <Link to="/dashboard-profesional">
              <Button className="w-full">Ver Pacientes</Button>
            </Link>
          </div>
        </div>

        {/* Professional Stats */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Información del Perfil</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-whatsapp-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Especialidades</p>
              <p className="text-xl font-bold text-whatsapp-600">
                {professionalData?.specialties?.length || 0}
              </p>
            </div>
            <div className="bg-whatsapp-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Años de experiencia</p>
              <p className="text-xl font-bold text-whatsapp-600">
                {professionalData?.experienceYears || 0}
              </p>
            </div>
            <div className="bg-whatsapp-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Modalidad</p>
              <p className="text-xl font-bold text-whatsapp-600 capitalize">
                {professionalData?.modality || 'No especificada'}
              </p>
            </div>
            <div className="bg-whatsapp-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Estado</p>
              <p className="text-xl font-bold text-green-600 capitalize">
                {professionalData?.isVerified ? 'Verificado' : 'Pendiente'}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Public view for users not logged in
function PublicHomeView() {
  const features = [
    {
      icon: Video,
      title: 'Encuentra tu Terapeuta',
      description: 'Conecta con profesionales verificados que entienden tu contexto y necesidades.',
      link: '/terapeutas',
      color: 'bg-whatsapp-100 text-whatsapp-600'
    },
    {
      icon: Users,
      title: 'Comunidad de Apoyo',
      description: 'Comparte experiencias y encuentra apoyo en un espacio seguro y moderado.',
      link: '/comunidad',
      color: 'bg-pink-100 text-pink-600'
    },
    {
      icon: BookOpen,
      title: 'Recursos y Guías',
      description: 'Accede a contenido educativo y líneas de emergencia cuando lo necesites.',
      link: '/recursos',
      color: 'bg-violet-100 text-violet-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-whatsapp-50 to-white">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Bienvenida a PurpleMatch
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Explora todas las herramientas que tenemos para ti.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/login">
              <Button className="bg-whatsapp-500 hover:bg-whatsapp-600 text-white px-8 py-3">
                Iniciar Sesión
              </Button>
            </Link>
            <Link to="/signup">
              <Button variant="outline" className="border-whatsapp-200 text-whatsapp-700 px-8 py-3">
                Registrarse
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature) => (
            <Link
              key={feature.title}
              to={feature.link}
              className="group p-6 bg-white rounded-2xl hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-whatsapp-200"
            >
              <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
