import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Layout from '@/client/components/Layout';
import { Button } from '@/client/components/ui/Button';
import { Input } from '@/client/components/ui/Input';
import { Label } from '@/client/components/ui/Label';
import { toast } from 'react-hot-toast';
import {
  Calendar,
  Users,
  MessageSquare,
  Settings,
  Star,
  Clock,
  Video,
  MapPin,
  CheckCircle,
  XCircle,
  AlertCircle,
  Edit3,
  Save,
  TrendingUp,
  Eye,
  Heart,
  Send,
  Search,
  Check,
  CheckCheck,
  LogOut
} from 'lucide-react';
import { Link } from 'react-router-dom';

type Tab = 'resumen' | 'citas' | 'pacientes' | 'mensajes' | 'perfil' | 'ajustes';

type ProfessionalProfile = {
  _id: string;
  fullName: string;
  description?: string;
  specialties: string[];
  modality: string;
  languages: string[];
  experienceYears: number;
  priceMin?: number;
  priceMax?: number;
  isVerified: boolean;
  availabilityStatus: string;
};

export default function DashboardProfesionalPage() {
  const [activeTab, setActiveTab] = useState<Tab>('resumen');

  const { data: profile, isLoading } = useQuery<ProfessionalProfile | null>({
    queryKey: ['professionalProfile'],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/profesional/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) return null;
      return response.json();
    }
  });

  if (isLoading) {
    return (
      <Layout showFooter={false}>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-whatsapp-600"></div>
        </div>
      </Layout>
    );
  }

  if (!profile) {
    return (
      <Layout showFooter={false}>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="w-16 h-16 bg-whatsapp-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-whatsapp-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              No tienes perfil profesional
            </h2>
            <p className="text-gray-600 mb-6">
              Para acceder al dashboard profesional, primero debes registrarte como profesional.
            </p>
            <Button
              className="bg-whatsapp-500 hover:bg-whatsapp-600 text-white"
              onClick={() => window.location.href = '/signup'}
            >
              Registrarse como profesional
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const tabs = [
    { id: 'resumen' as Tab, label: 'Resumen', icon: TrendingUp },
    { id: 'citas' as Tab, label: 'Citas', icon: Calendar },
    { id: 'pacientes' as Tab, label: 'Pacientes', icon: Users },
    { id: 'mensajes' as Tab, label: 'Mensajes', icon: MessageSquare },
    { id: 'perfil' as Tab, label: 'Mi Perfil', icon: Eye },
    { id: 'ajustes' as Tab, label: 'Ajustes', icon: Settings },
  ];

  return (
    <Layout showFooter={false}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-whatsapp-100 rounded-full flex items-center justify-center">
                  <span className="text-whatsapp-600 font-bold text-xl">
                    {profile.fullName.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl font-semibold text-gray-900">{profile.fullName}</h1>
                    {profile.isVerified ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                        <CheckCircle className="w-3 h-3" />
                        Verificada
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
                        <Clock className="w-3 h-3" />
                        Pendiente verificacion
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">
                    {profile.specialties.slice(0, 3).join(' · ')}
                    {profile.specialties.length > 3 && ` +${profile.specialties.length - 3}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <AvailabilityToggle currentStatus={profile.availabilityStatus} />
                <Button
                  variant="ghost"
                  className="text-gray-600 hover:text-red-600"
                  onClick={() => {
                    localStorage.removeItem('token');
                    window.location.href = '/';
                  }}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Cerrar sesión
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white border-b border-gray-200 sticky top-16 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex gap-1 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-whatsapp-600 text-whatsapp-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activeTab === 'resumen' && <ResumenTab profile={profile} />}
          {activeTab === 'citas' && <CitasTab />}
          {activeTab === 'pacientes' && <PacientesTab />}
          {activeTab === 'mensajes' && <MensajesTab />}
          {activeTab === 'perfil' && <PerfilTab profile={profile} />}
          {activeTab === 'ajustes' && <AjustesTab profile={profile} />}
        </div>
      </div>
    </Layout>
  );
}

function AvailabilityToggle({ currentStatus }: { currentStatus: string }) {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState(currentStatus);

  const updateProfileMutation = useMutation({
    mutationFn: async (data: { availabilityStatus: string }) => {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/profesional/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ availability_status: data.availabilityStatus })
      });
      if (!response.ok) throw new Error('Error al actualizar estado');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['professionalProfile'] });
      toast.success('Estado actualizado');
    },
  });

  const handleChange = (newStatus: string) => {
    setStatus(newStatus);
    updateProfileMutation.mutate({ availabilityStatus: newStatus });
  };

  return (
    <div className="flex items-center gap-2">
      <select
        value={status}
        onChange={(e) => handleChange(e.target.value)}
        className={`px-3 py-2 rounded-lg text-sm font-medium border ${
          status === 'available'
            ? 'bg-green-50 border-green-200 text-green-700'
            : status === 'busy'
            ? 'bg-yellow-50 border-yellow-200 text-yellow-700'
            : 'bg-gray-50 border-gray-200 text-gray-700'
        }`}
      >
        <option value="available">Disponible</option>
        <option value="busy">Ocupada</option>
        <option value="on_vacation">De vacaciones</option>
      </select>
    </div>
  );
}

function ResumenTab({ profile }: { profile: ProfessionalProfile }) {
  // Mock stats - in production these would come from actual data
  const stats = {
    citasEsteMes: 12,
    pacientesActivos: 8,
    valoracionMedia: 4.8,
    visitasPerfil: 45,
  };

  const upcomingSessions = [
    { id: '1', patientName: 'Maria L.', time: '10:00', date: 'Hoy', modality: 'online' },
    { id: '2', patientName: 'Ana G.', time: '12:30', date: 'Hoy', modality: 'online' },
    { id: '3', patientName: 'Carmen R.', time: '16:00', date: 'Manana', modality: 'presencial' },
  ];

  return (
    <div className="space-y-6">
      {/* Verification Notice */}
      {!profile.isVerified && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-yellow-800">Verificacion pendiente</h3>
              <p className="text-sm text-yellow-700 mt-1">
                Tu perfil esta siendo revisado por nuestro equipo. Una vez verificado,
                apareceras en los resultados de busqueda y podras recibir solicitudes de citas.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Citas este mes"
          value={stats.citasEsteMes}
          icon={Calendar}
          color="purple"
        />
        <StatCard
          label="Pacientes activas"
          value={stats.pacientesActivos}
          icon={Users}
          color="blue"
        />
        <StatCard
          label="Valoracion media"
          value={stats.valoracionMedia}
          icon={Star}
          color="yellow"
          suffix="/5"
        />
        <StatCard
          label="Visitas al perfil"
          value={stats.visitasPerfil}
          icon={Eye}
          color="green"
        />
      </div>

      {/* Upcoming Sessions */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Proximas citas</h2>
          <Button variant="ghost" className="text-whatsapp-600 hover:text-whatsapp-700">
            Ver todas
          </Button>
        </div>

        {upcomingSessions.length > 0 ? (
          <div className="space-y-3">
            {upcomingSessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-whatsapp-100 rounded-full flex items-center justify-center">
                    <span className="text-whatsapp-600 font-medium">
                      {session.patientName.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{session.patientName}</p>
                    <p className="text-sm text-gray-500">
                      {session.date} a las {session.time}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                    session.modality === 'online'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-green-100 text-green-700'
                  }`}>
                    {session.modality === 'online' ? (
                      <><Video className="w-3 h-3" /> Online</>
                    ) : (
                      <><MapPin className="w-3 h-3" /> Presencial</>
                    )}
                  </span>
                  <Button size="sm" className="bg-whatsapp-500 hover:bg-whatsapp-600 text-white">
                    Iniciar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No tienes citas programadas</p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-4">
        <button className="p-4 bg-white border border-gray-200 rounded-xl hover:border-whatsapp-300 hover:bg-whatsapp-50 transition-colors text-left">
          <MessageSquare className="w-6 h-6 text-whatsapp-600 mb-2" />
          <h3 className="font-medium text-gray-900">Mensajes</h3>
          <p className="text-sm text-gray-500">3 sin leer</p>
        </button>
        <button className="p-4 bg-white border border-gray-200 rounded-xl hover:border-whatsapp-300 hover:bg-whatsapp-50 transition-colors text-left">
          <Heart className="w-6 h-6 text-whatsapp-600 mb-2" />
          <h3 className="font-medium text-gray-900">Solicitudes</h3>
          <p className="text-sm text-gray-500">2 nuevas</p>
        </button>
        <button className="p-4 bg-white border border-gray-200 rounded-xl hover:border-whatsapp-300 hover:bg-whatsapp-50 transition-colors text-left">
          <Settings className="w-6 h-6 text-whatsapp-600 mb-2" />
          <h3 className="font-medium text-gray-900">Configuracion</h3>
          <p className="text-sm text-gray-500">Horarios y tarifas</p>
        </button>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  color,
  suffix = ''
}: {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  color: 'purple' | 'blue' | 'yellow' | 'green';
  suffix?: string;
}) {
  const colors = {
    purple: 'bg-whatsapp-100 text-whatsapp-600',
    blue: 'bg-blue-100 text-blue-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    green: 'bg-green-100 text-green-600',
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${colors[color]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-2xl font-bold text-gray-900">
        {value}{suffix}
      </p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
}

function CitasTab() {
  const [filter, setFilter] = useState<'upcoming' | 'past' | 'cancelled'>('upcoming');

  // Mock data
  const sessions = [
    { id: '1', patientName: 'Maria Lopez', date: '2026-03-08', time: '10:00', status: 'scheduled', modality: 'online' },
    { id: '2', patientName: 'Ana Garcia', date: '2026-03-08', time: '12:30', status: 'scheduled', modality: 'online' },
    { id: '3', patientName: 'Carmen Rodriguez', date: '2026-03-09', time: '16:00', status: 'scheduled', modality: 'presencial' },
    { id: '4', patientName: 'Laura Martinez', date: '2026-03-10', time: '11:00', status: 'scheduled', modality: 'online' },
  ];

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex gap-2">
        {(['upcoming', 'past', 'cancelled'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === f
                ? 'bg-whatsapp-100 text-whatsapp-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {f === 'upcoming' ? 'Proximas' : f === 'past' ? 'Pasadas' : 'Canceladas'}
          </button>
        ))}
      </div>

      {/* Sessions List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="divide-y divide-gray-100">
          {sessions.map((session) => (
            <div key={session.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-whatsapp-100 rounded-full flex items-center justify-center">
                    <span className="text-whatsapp-600 font-semibold">
                      {session.patientName.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{session.patientName}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(session.date).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
                      {' '}a las {session.time}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                    session.modality === 'online'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-green-100 text-green-700'
                  }`}>
                    {session.modality === 'online' ? (
                      <><Video className="w-3 h-3" /> Online</>
                    ) : (
                      <><MapPin className="w-3 h-3" /> Presencial</>
                    )}
                  </span>
                  <Button variant="outline" size="sm">
                    Ver detalles
                  </Button>
                  <Button size="sm" className="bg-whatsapp-500 hover:bg-whatsapp-600 text-white">
                    Iniciar sesion
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PacientesTab() {
  // Mock data
  const patients = [
    { id: '1', name: 'Maria Lopez', sessionsCount: 8, lastSession: '2026-03-01', status: 'active' },
    { id: '2', name: 'Ana Garcia', sessionsCount: 5, lastSession: '2026-02-28', status: 'active' },
    { id: '3', name: 'Carmen Rodriguez', sessionsCount: 12, lastSession: '2026-02-25', status: 'active' },
    { id: '4', name: 'Laura Martinez', sessionsCount: 3, lastSession: '2026-02-20', status: 'inactive' },
  ];

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">8</p>
          <p className="text-sm text-gray-500">Pacientes activas</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">28</p>
          <p className="text-sm text-gray-500">Total sesiones</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">4.8</p>
          <p className="text-sm text-gray-500">Valoracion media</p>
        </div>
      </div>

      {/* Patients List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">Mis pacientes</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {patients.map((patient) => (
            <div key={patient.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-whatsapp-100 rounded-full flex items-center justify-center">
                    <span className="text-whatsapp-600 font-semibold">
                      {patient.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{patient.name}</p>
                    <p className="text-sm text-gray-500">
                      {patient.sessionsCount} sesiones · Ultima: {new Date(patient.lastSession).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    patient.status === 'active'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {patient.status === 'active' ? 'Activa' : 'Inactiva'}
                  </span>
                  <Button variant="outline" size="sm">
                    Ver historial
                  </Button>
                  <Button size="sm" className="bg-whatsapp-500 hover:bg-whatsapp-600 text-white">
                    Mensaje
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PerfilTab({ profile }: { profile: ProfessionalProfile }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedDescription, setEditedDescription] = useState(profile.description || '');
  const queryClient = useQueryClient();

  const updateProfileMutation = useMutation({
    mutationFn: async (data: { description: string }) => {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/profesional/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ description: data.description })
      });
      if (!response.ok) throw new Error('Error al actualizar perfil');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['professionalProfile'] });
      toast.success('Perfil actualizado');
      setIsEditing(false);
    },
  });

  const isPending = updateProfileMutation.isPending;

  const handleSave = () => {
    updateProfileMutation.mutate({ description: editedDescription });
  };

  return (
    <div className="space-y-6">
      {/* Preview Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Vista previa del perfil</h2>
          <Button
            variant="outline"
            onClick={() => setIsEditing(!isEditing)}
          >
            <Edit3 className="w-4 h-4 mr-2" />
            {isEditing ? 'Cancelar' : 'Editar'}
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Photo */}
          <div className="flex-shrink-0">
            <div className="w-32 h-32 bg-whatsapp-100 rounded-xl flex items-center justify-center overflow-hidden">
              <img 
                src="/imgEstudiando2.png" 
                alt="Foto de perfil" 
                className="w-full h-full object-cover object-top"
              />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-xl font-semibold text-gray-900">{profile.fullName}</h3>
              {profile.isVerified && (
                <CheckCircle className="w-5 h-5 text-green-500" />
              )}
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {profile.specialties.map((specialty) => (
                <span
                  key={specialty}
                  className="px-3 py-1 bg-whatsapp-100 text-whatsapp-700 rounded-full text-sm font-medium"
                >
                  {specialty}
                </span>
              ))}
            </div>

            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <Label className="block mb-2">Descripcion</Label>
                  <textarea
                    value={editedDescription}
                    onChange={(e) => setEditedDescription(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-whatsapp-500 focus:ring-whatsapp-500"
                    placeholder="Describe tu enfoque terapeutico..."
                  />
                </div>
                <Button
                  onClick={handleSave}
                  disabled={isPending}
                  className="bg-whatsapp-500 hover:bg-whatsapp-600 text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isPending ? 'Guardando...' : 'Guardar cambios'}
                </Button>
              </div>
            ) : (
              <p className="text-gray-600 mb-4">
                {profile.description || 'Sin descripcion. Haz clic en Editar para añadir una.'}
              </p>
            )}

            {!isEditing && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-100">
                <div>
                  <p className="text-sm text-gray-500">Experiencia</p>
                  <p className="font-medium text-gray-900">{profile.experienceYears} años</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Modalidad</p>
                  <p className="font-medium text-gray-900">
                    {profile.modality === 'online' ? 'Online' :
                     profile.modality === 'presential' ? 'Presencial' : 'Ambas'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Idiomas</p>
                  <p className="font-medium text-gray-900">{profile.languages.join(', ')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Precio</p>
                  <p className="font-medium text-gray-900">
                    {profile.priceMin && profile.priceMax
                      ? `${profile.priceMin}-${profile.priceMax}€`
                      : 'Consultar'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Estadisticas del perfil</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-gray-900">45</p>
            <p className="text-sm text-gray-500">Visitas este mes</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-gray-900">12</p>
            <p className="text-sm text-gray-500">Guardada por</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-gray-900">8</p>
            <p className="text-sm text-gray-500">Solicitudes</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-gray-900">4.8</p>
            <p className="text-sm text-gray-500">Valoracion</p>
          </div>
        </div>
      </div>
    </div>
  );
}

type Message = {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read';
};

type Conversation = {
  id: string;
  recipientId: string;
  recipientName: string;
  recipientAvatar: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  isOnline: boolean;
};

const mockPatientConversations: Conversation[] = [
  {
    id: 'conv1',
    recipientId: 'patient1',
    recipientName: 'Maria Lopez',
    recipientAvatar: 'ML',
    lastMessage: 'Gracias por la sesion de hoy, me siento mucho mejor.',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 30),
    unreadCount: 1,
    isOnline: true
  },
  {
    id: 'conv2',
    recipientId: 'patient2',
    recipientName: 'Ana Garcia',
    recipientAvatar: 'AG',
    lastMessage: 'Queria preguntarle sobre el ejercicio de respiracion.',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 2),
    unreadCount: 2,
    isOnline: false
  },
  {
    id: 'conv3',
    recipientId: 'patient3',
    recipientName: 'Carmen Rodriguez',
    recipientAvatar: 'CR',
    lastMessage: 'Perfecto, nos vemos el martes entonces.',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 5),
    unreadCount: 0,
    isOnline: true
  }
];

const mockPatientMessages: Record<string, Message[]> = {
  'patient1': [
    {
      id: 'm1',
      senderId: 'patient1',
      content: 'Hola Dra., queria agradecerle por la sesion de hoy.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
      status: 'read'
    },
    {
      id: 'm2',
      senderId: 'me',
      content: 'Me alegra que te haya sido util! Recuerda practicar los ejercicios que vimos.',
      timestamp: new Date(Date.now() - 1000 * 60 * 45),
      status: 'read'
    },
    {
      id: 'm3',
      senderId: 'patient1',
      content: 'Gracias por la sesion de hoy, me siento mucho mejor.',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      status: 'delivered'
    }
  ],
  'patient2': [
    {
      id: 'm1',
      senderId: 'patient2',
      content: 'Hola Dra., tengo una duda sobre lo que hablamos.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
      status: 'read'
    },
    {
      id: 'm2',
      senderId: 'patient2',
      content: 'Queria preguntarle sobre el ejercicio de respiracion.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      status: 'delivered'
    }
  ]
};

function MensajesTab() {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');

  const filteredConversations = mockPatientConversations.filter(conv =>
    conv.recipientName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectConversation = (conv: Conversation) => {
    setSelectedConversation(conv);
    setMessages(mockPatientMessages[conv.recipientId] || []);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const message: Message = {
      id: `m${Date.now()}`,
      senderId: 'me',
      content: newMessage,
      timestamp: new Date(),
      status: 'sent'
    };

    setMessages([...messages, message]);
    setNewMessage('');
  };

  const formatTime = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Ahora';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days === 1) return 'Ayer';
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden" style={{ height: '600px' }}>
      <div className="flex h-full">
        {/* Conversation List */}
        <div className="w-80 border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar pacientes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-whatsapp-500"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredConversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => handleSelectConversation(conv)}
                className={`w-full p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors border-b border-gray-50 text-left ${
                  selectedConversation?.id === conv.id ? 'bg-whatsapp-50' : ''
                }`}
              >
                <div className="relative flex-shrink-0">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-sm">{conv.recipientAvatar}</span>
                  </div>
                  {conv.isOnline && (
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-gray-900 text-sm truncate">{conv.recipientName}</h3>
                    <span className="text-xs text-gray-400">{formatTime(conv.lastMessageTime)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500 truncate">{conv.lastMessage}</p>
                    {conv.unreadCount > 0 && (
                      <span className="w-5 h-5 bg-whatsapp-500 text-white text-xs rounded-full flex items-center justify-center flex-shrink-0 ml-2">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold">{selectedConversation.recipientAvatar}</span>
                    </div>
                    {selectedConversation.isOnline && (
                      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
                    )}
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900">{selectedConversation.recipientName}</h2>
                    <p className="text-xs text-gray-500">
                      {selectedConversation.isOnline ? 'En linea' : 'Desconectada'}
                    </p>
                  </div>
                </div>
                <Link to={`/chat/${selectedConversation.recipientId}`}>
                  <Button variant="outline" size="sm">
                    Abrir chat completo
                  </Button>
                </Link>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.senderId === 'me' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[70%] ${message.senderId === 'me' ? 'order-2' : ''}`}>
                      <div className={`px-4 py-2 rounded-2xl ${
                        message.senderId === 'me'
                          ? 'bg-whatsapp-500 text-white rounded-br-md'
                          : 'bg-white text-gray-900 rounded-bl-md shadow-sm'
                      }`}>
                        <p className="text-sm">{message.content}</p>
                      </div>
                      <div className={`flex items-center gap-1 mt-1 ${message.senderId === 'me' ? 'justify-end' : ''}`}>
                        <span className="text-xs text-gray-400">{formatTime(message.timestamp)}</span>
                        {message.senderId === 'me' && (
                          <span className="text-gray-400">
                            {message.status === 'read' ? (
                              <CheckCheck className="w-3 h-3 text-whatsapp-500" />
                            ) : message.status === 'delivered' ? (
                              <CheckCheck className="w-3 h-3" />
                            ) : (
                              <Check className="w-3 h-3" />
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Escribe un mensaje..."
                    className="flex-1 px-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-whatsapp-500"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="bg-whatsapp-500 hover:bg-whatsapp-600 text-white"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <div className="w-16 h-16 bg-whatsapp-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-8 h-8 text-whatsapp-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Mensajes de pacientes</h2>
                <p className="text-gray-500 max-w-sm">
                  Selecciona una conversacion para ver y responder mensajes
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AjustesTab({ profile }: { profile: ProfessionalProfile }) {
  const queryClient = useQueryClient();
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>(profile.specialties);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(profile.languages);

  const updateProfileMutation = useMutation({
    mutationFn: async (data: {
      modality: string;
      priceMin?: number;
      priceMax?: number;
      location: string;
      specialties: string[];
      languages: string[];
    }) => {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/profesional/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          modality: data.modality,
          price_min: data.priceMin,
          price_max: data.priceMax,
          location: data.location,
          specialties: data.specialties,
          languages: data.languages
        })
      });
      if (!response.ok) throw new Error('Error al guardar configuración');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['professionalProfile'] });
      toast.success('Configuracion guardada');
    },
  });

  const isPending = updateProfileMutation.isPending;

  const specialties = [
    'Ansiedad', 'Depresion', 'Trauma', 'Relaciones',
    'Autoestima', 'Duelo', 'Estres laboral', 'Trastornos alimentarios',
    'Violencia de genero', 'Maternidad', 'LGBTQ+', 'Adicciones'
  ];

  const languages = ['Español', 'Catalan', 'Euskera', 'Gallego', 'Ingles', 'Frances'];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    updateProfileMutation.mutate({
      modality: String(formData.get('modality')),
      priceMin: parseInt(String(formData.get('priceMin'))) || undefined,
      priceMax: parseInt(String(formData.get('priceMax'))) || undefined,
      location: String(formData.get('location')),
      specialties: selectedSpecialties,
      languages: selectedLanguages,
    });
  };

  return (
    <div className="max-w-2xl space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Specialties */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Especialidades</h3>
          <div className="flex flex-wrap gap-2">
            {specialties.map((specialty) => (
              <button
                key={specialty}
                type="button"
                onClick={() => {
                  setSelectedSpecialties(prev =>
                    prev.includes(specialty)
                      ? prev.filter(s => s !== specialty)
                      : [...prev, specialty]
                  );
                }}
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
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Modalidad y ubicacion</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="modality" className="block mb-2">Modalidad</Label>
              <select
                name="modality"
                id="modality"
                defaultValue={profile.modality}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg"
              >
                <option value="online">Solo online</option>
                <option value="presential">Solo presencial</option>
                <option value="both">Online y presencial</option>
              </select>
            </div>
            <div>
              <Label htmlFor="location" className="block mb-2">Ubicacion</Label>
              <Input
                name="location"
                id="location"
                placeholder="Madrid, España"
                className="border-gray-200"
              />
            </div>
          </div>
        </div>

        {/* Languages */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Idiomas</h3>
          <div className="flex flex-wrap gap-2">
            {languages.map((language) => (
              <button
                key={language}
                type="button"
                onClick={() => {
                  setSelectedLanguages(prev =>
                    prev.includes(language)
                      ? prev.filter(l => l !== language)
                      : [...prev, language]
                  );
                }}
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
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Tarifas</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="priceMin" className="block mb-2">Precio minimo (€)</Label>
              <Input
                type="number"
                name="priceMin"
                id="priceMin"
                defaultValue={profile.priceMin}
                min="0"
                className="border-gray-200"
              />
            </div>
            <div>
              <Label htmlFor="priceMax" className="block mb-2">Precio maximo (€)</Label>
              <Input
                type="number"
                name="priceMax"
                id="priceMax"
                defaultValue={profile.priceMax}
                min="0"
                className="border-gray-200"
              />
            </div>
          </div>
        </div>

        <Button
          type="submit"
          disabled={isPending}
          className="w-full bg-whatsapp-500 hover:bg-whatsapp-600 text-white"
        >
          {isPending ? 'Guardando...' : 'Guardar configuracion'}
        </Button>
      </form>

      {/* Danger Zone */}
      <div className="bg-white rounded-xl border border-red-200 p-6">
        <h3 className="font-semibold text-red-600 mb-2">Zona de peligro</h3>
        <p className="text-sm text-gray-600 mb-4">
          Estas acciones son irreversibles. Procede con cuidado.
        </p>
        <div className="flex gap-3">
          <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
            <XCircle className="w-4 h-4 mr-2" />
            Desactivar perfil
          </Button>
        </div>
      </div>
    </div>
  );
}
