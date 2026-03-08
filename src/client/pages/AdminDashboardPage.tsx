import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Users, 
  UserCheck, 
  UserX, 
  LogOut, 
  Check, 
  X, 
  Search,
  Shield
} from 'lucide-react';
import { Button } from '@/client/components/ui/Button';
import Layout from '@/client/components/Layout';

interface Stats {
  totalUsers: number;
  totalProfessionals: number;
  activeProfessionals: number;
  pendingProfessionals: number;
  totalSessions: number;
}

interface Professional {
  id: number;
  userId: number;
  email: string;
  handle: string;
  fullName: string;
  specialties: string[];
  languages: string[];
  modality: string;
  experienceYears: number;
  priceMin: number;
  priceMax: number;
  isVerified: boolean;
  isVolunteer: boolean;
  location: string;
  createdAt: string;
}

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch admin stats
  const { data: stats, isLoading: statsLoading } = useQuery<Stats>({
    queryKey: ['adminStats'],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Error fetching stats');
      return response.json();
    }
  });

  // Fetch all professionals
  const { data: professionals = [], isLoading: professionalsLoading } = useQuery<Professional[]>({
    queryKey: ['adminProfessionals'],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/professionals', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Error fetching professionals');
      return response.json();
    }
  });

  // Verify professional mutation
  const verifyMutation = useMutation({
    mutationFn: async (id: number) => {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/professionals/${id}/verify`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Error verifying professional');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
      queryClient.invalidateQueries({ queryKey: ['adminProfessionals'] });
    }
  });

  // Delete professional mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/professionals/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Error deleting professional');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
      queryClient.invalidateQueries({ queryKey: ['adminProfessionals'] });
    }
  });

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  const filteredProfessionals = professionals.filter(p => 
    p.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingProfessionals = filteredProfessionals.filter(p => !p.isVerified);
  const activeProfessionals = filteredProfessionals.filter(p => p.isVerified);

  if (statsLoading || professionalsLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-whatsapp-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout showNavigation={false}>
      <div className="bg-gray-50 min-h-[calc(100vh-64px)]">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-whatsapp-100 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-whatsapp-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Panel de Administrador</h1>
                <p className="text-gray-500">Gestiona usuarios y profesionales</p>
              </div>
            </div>
            <Button 
              onClick={handleLogout}
              variant="outline"
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Cerrar sesión
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Usuarios</p>
                  <p className="text-2xl font-bold text-gray-900">{stats?.totalUsers || 0}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <UserCheck className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Profesionales Activos</p>
                  <p className="text-2xl font-bold text-gray-900">{stats?.activeProfessionals || 0}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <UserX className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Pendientes de Verificación</p>
                  <p className="text-2xl font-bold text-gray-900">{stats?.pendingProfessionals || 0}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-whatsapp-100 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-whatsapp-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Profesionales</p>
                  <p className="text-2xl font-bold text-gray-900">{stats?.totalProfessionals || 0}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar profesionales..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-whatsapp-500"
              />
            </div>
          </div>

          {/* Pending Professionals Section */}
          {pendingProfessionals.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Profesionales Pendientes de Verificación ({pendingProfessionals.length})
              </h2>
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Profesional
                        </th>
                        <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Especialidades
                        </th>
                        <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Modalidad
                        </th>
                        <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Experiencia
                        </th>
                        <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Precio
                        </th>
                        <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {pendingProfessionals.map((professional) => (
                        <tr key={professional.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-medium text-gray-900">{professional.fullName}</p>
                              <p className="text-sm text-gray-500">{professional.email}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-1">
                              {professional.specialties?.slice(0, 3).map((s, i) => (
                                <span key={i} className="px-2 py-1 bg-whatsapp-50 text-whatsapp-700 rounded-full text-xs">
                                  {s}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-600 capitalize">{professional.modality}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-600">{professional.experienceYears} años</span>
                          </td>
                          <td className="px-6 py-4">
                            {professional.isVolunteer ? (
                              <span className="text-green-600 font-medium">Voluntario</span>
                            ) : (
                              <span className="text-sm text-gray-600">€{professional.priceMin} - €{professional.priceMax}</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                size="sm"
                                onClick={() => verifyMutation.mutate(professional.id)}
                                className="bg-whatsapp-500 hover:bg-whatsapp-600 text-white"
                                disabled={verifyMutation.isPending}
                              >
                                <Check className="w-4 h-4 mr-1" />
                                Verificar
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => {
                                  if (confirm('¿Estás seguro de eliminar este profesional?')) {
                                    deleteMutation.mutate(professional.id);
                                  }
                                }}
                                disabled={deleteMutation.isPending}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Active Professionals Section */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Profesionales Verificados ({activeProfessionals.length})
            </h2>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              {activeProfessionals.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  No hay profesionales verificados
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Profesional
                        </th>
                        <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Especialidades
                        </th>
                        <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Modalidad
                        </th>
                        <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ubicación
                        </th>
                        <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Estado
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {activeProfessionals.map((professional) => (
                        <tr key={professional.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-medium text-gray-900">{professional.fullName}</p>
                              <p className="text-sm text-gray-500">{professional.email}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-1">
                              {professional.specialties?.slice(0, 3).map((s, i) => (
                                <span key={i} className="px-2 py-1 bg-whatsapp-50 text-whatsapp-700 rounded-full text-xs">
                                  {s}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-600 capitalize">{professional.modality}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-600">{professional.location || '-'}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Verificado
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </Layout>
  );
}
