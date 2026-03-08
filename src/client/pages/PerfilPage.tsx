import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  User,
  BookOpen,
  TrendingUp,
  Settings,
  Calendar,
  MessageCircle,
  PenLine,
  Target,
  Award,
  Smile,
  Meh,
  Frown,
  Zap,
  Lock,
  Bell,
  Mail,
  Camera,
  Check,
  ChevronRight,
  Sparkles,
  FileText,
  Upload
} from 'lucide-react';
import { Button } from '@/client/components/ui/Button';
import { Input } from '@/client/components/ui/Input';
import { Label } from '@/client/components/ui/Label';
import Layout from '@/client/components/Layout';
import { toast } from 'react-hot-toast';

type Tab = 'resumen' | 'diario' | 'progreso' | 'historial' | 'ajustes';
type MoodType = 'muy-bien' | 'bien' | 'neutral' | 'triste' | 'ansiosa';

const moods = [
  { id: 'muy-bien', label: 'Muy bien', icon: Heart, color: 'bg-green-100 text-green-600 border-green-200' },
  { id: 'bien', label: 'Bien', icon: Smile, color: 'bg-emerald-100 text-emerald-600 border-emerald-200' },
  { id: 'neutral', label: 'Neutral', icon: Meh, color: 'bg-yellow-100 text-yellow-600 border-yellow-200' },
  { id: 'triste', label: 'Triste', icon: Frown, color: 'bg-blue-100 text-blue-600 border-blue-200' },
  { id: 'ansiosa', label: 'Ansiosa', icon: Zap, color: 'bg-orange-100 text-orange-600 border-orange-200' }
] as const;

type JournalEntry = {
  id: string;
  mood: MoodType;
  content: string;
  date: string;
  tags: string[];
};

const mockJournalEntries: JournalEntry[] = [
  {
    id: '1',
    mood: 'bien',
    content: 'Hoy tuve una buena sesion con mi terapeuta. Hablamos sobre establecer limites y me siento mas preparada para aplicarlo.',
    date: 'Hoy, 10:30',
    tags: ['terapia', 'limites']
  },
  {
    id: '2',
    mood: 'neutral',
    content: 'Dia tranquilo. Practique la respiracion que aprendi y me ayudo a calmarme cuando senti ansiedad.',
    date: 'Ayer, 21:00',
    tags: ['respiracion', 'ansiedad']
  },
  {
    id: '3',
    mood: 'triste',
    content: 'Me senti un poco abrumada hoy. Es normal tener dias asi, pero escribirlo me ayuda a procesarlo.',
    date: 'Hace 2 dias',
    tags: ['procesando']
  }
];

const mockGoals = [
  { id: '1', title: 'Practicar respiracion diaria', description: '10 minutos de ejercicios', progress: 80, completed: false },
  { id: '2', title: 'Establecer limites claros', description: 'En relaciones personales', progress: 60, completed: false },
  { id: '3', title: 'Escribir en el diario', description: '3 veces por semana', progress: 100, completed: true },
  { id: '4', title: 'Asistir a sesiones', description: 'Sesiones semanales', progress: 90, completed: false }
];

const mockMilestones = [
  { id: '1', title: 'Primera sesion', icon: Calendar, achieved: true },
  { id: '2', title: '5 sesiones', icon: Target, achieved: true },
  { id: '3', title: 'Primera meta cumplida', icon: Award, achieved: true },
  { id: '4', title: '30 dias de diario', icon: BookOpen, achieved: false },
  { id: '5', title: '10 sesiones', icon: Sparkles, achieved: false }
];

const mockClinicalHistory = {
  previousDiagnosis: 'Trastorno de ansiedad generalizada',
  currentMedication: 'Ninguna actualmente',
  allergies: 'Sin alergias conocidas',
  previousTherapy: 'Terapia cognitivo-conductual (2023-2024)',
  familyHistory: 'Historia familiar de ansiedad',
  notes: 'Prefiero sesiones vespertinas. Trabajo mejor con enfoque practico y tareas entre sesiones.'
};

export default function PerfilPage() {
  const [activeTab, setActiveTab] = useState<Tab>('resumen');

  // Mock user for demo purposes (no authentication required)
  const user = { handle: 'Usuario' };

  const tabs = [
    { id: 'resumen', label: 'Resumen', icon: User },
    { id: 'diario', label: 'Diario', icon: BookOpen },
    { id: 'progreso', label: 'Progreso', icon: TrendingUp },
    { id: 'historial', label: 'Historial', icon: FileText },
    { id: 'ajustes', label: 'Ajustes', icon: Settings }
  ] as const;

  return (
    <Layout showFooter={false}>
      {/* Profile Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-whatsapp-600">
              <img src="/imgHappy.png" alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-900">{user.handle || 'Usuario'}</h1>
                <span className="px-3 py-1 bg-whatsapp-600 text-white rounded-full text-sm flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  Perfil Privado
                </span>
              </div>
              <p className="text-gray-500 mb-1">Miembro desde marzo 2026</p>
              <p className="text-gray-600 italic">"Cada dia es una nueva oportunidad"</p>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="bg-white rounded-2xl p-2 mb-8 shadow-sm">
          <nav className="flex gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-colors ${
                    isActive
                      ? 'bg-whatsapp-100 text-whatsapp-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'resumen' && <ResumenTab user={user} />}
        {activeTab === 'diario' && <DiarioTab />}
        {activeTab === 'progreso' && <ProgresoTab />}
        {activeTab === 'historial' && <HistorialTab />}
        {activeTab === 'ajustes' && <AjustesTab user={user} />}
      </main>
    </Layout>
  );
}

function ResumenTab({ user }: { user: { handle?: string } }) {
  const navigate = useNavigate();
  const [contactedProfessional, setContactedProfessional] = useState<{id: string, name: string} | null>(null);

  useEffect(() => {
    // Check for contacted professional from localStorage
    const professionalId = localStorage.getItem('contactedProfessionalId');
    const professionalName = localStorage.getItem('contactedProfessionalName');
    if (professionalId && professionalName) {
      setContactedProfessional({ id: professionalId, name: professionalName });
    }
  }, []);

  const handleConectar = () => {
    if (contactedProfessional) {
      // Navigate to chat with this professional and show the message interface
      navigate(`/chat/${contactedProfessional.id}`);
    }
  };
  const stats = [
    { label: 'Entradas en diario', value: '12', icon: BookOpen },
    { label: 'Sesiones completadas', value: '8', icon: Calendar },
    { label: 'Mejora bienestar', value: '35%', icon: TrendingUp },
    { label: 'Dias activos', value: '28', icon: Sparkles }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-whatsapp-100 rounded-xl flex items-center justify-center">
                  <Icon className="w-5 h-5 text-whatsapp-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* My Therapist */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Mi Terapeuta</h2>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-whatsapp-100 rounded-full flex items-center justify-center">
              <span className="text-xl font-bold text-whatsapp-600">MG</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Dra. Maria Garcia</h3>
              <p className="text-sm text-gray-500">Ansiedad, Trauma</p>
              <p className="text-sm text-green-600">Proxima sesion: Jueves 14:00</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {contactedProfessional ? (
              <Button 
                onClick={handleConectar} 
                className="bg-whatsapp-500 hover:bg-whatsapp-600 text-white"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Conectar
              </Button>
            ) : (
              <Link to="/chat/therapist1">
                <Button className="bg-whatsapp-500 hover:bg-whatsapp-600 text-white">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Mensaje
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-4">
        <Link
          to="/perfil"
          onClick={() => {}}
          className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4"
        >
          <div className="w-12 h-12 bg-whatsapp-100 rounded-xl flex items-center justify-center">
            <PenLine className="w-6 h-6 text-whatsapp-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Escribir en diario</h3>
            <p className="text-sm text-gray-500">Registra como te sientes</p>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400 ml-auto" />
        </Link>

        <Link
          to="/terapeutas"
          className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4"
        >
          <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
            <Calendar className="w-6 h-6 text-pink-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Agendar sesion</h3>
            <p className="text-sm text-gray-500">Reserva tu proxima cita</p>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400 ml-auto" />
        </Link>

        <Link
          to="/comunidad"
          className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4"
        >
          <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center">
            <MessageCircle className="w-6 h-6 text-violet-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Ir a la comunidad</h3>
            <p className="text-sm text-gray-500">Conecta con otras</p>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400 ml-auto" />
        </Link>
      </div>

    </div>
  );
}

function DiarioTab() {
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [journalText, setJournalText] = useState('');
  const [entries, setEntries] = useState(mockJournalEntries);

  const weekSummary = {
    'muy-bien': 2,
    'bien': 3,
    'neutral': 1,
    'triste': 1,
    'ansiosa': 0
  };

  const handleSaveEntry = () => {
    if (!selectedMood || !journalText.trim()) return;
    
    const newEntry = {
      id: Date.now().toString(),
      mood: selectedMood,
      content: journalText,
      date: new Date().toLocaleDateString('es-CO', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      tags: []
    };
    
    setEntries([newEntry, ...entries]);
    setSelectedMood(null);
    setJournalText('');
    toast.success('Entrada guardada en tu diario');
  };

  return (
    <div className="space-y-6">
      {/* New Entry */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Como te sientes hoy?</h2>

        {/* Mood Selector */}
        <div className="flex flex-wrap gap-3 mb-6">
          {moods.map((mood) => {
            const Icon = mood.icon;
            const isSelected = selectedMood === mood.id;
            return (
              <button
                key={mood.id}
                onClick={() => setSelectedMood(mood.id)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all ${
                  isSelected
                    ? `${mood.color} border-current`
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{mood.label}</span>
              </button>
            );
          })}
        </div>

        {/* Journal Editor */}
        <textarea
          value={journalText}
          onChange={(e) => setJournalText(e.target.value)}
          placeholder="Escribe tus pensamientos, reflexiones o como ha sido tu dia..."
          rows={4}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-whatsapp-500 focus:border-transparent resize-none mb-4"
        />

        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Escribe libremente. Solo tu puedes ver esto.
          </p>
          <Button
            onClick={handleSaveEntry}
            disabled={!selectedMood || !journalText.trim()}
            className="bg-whatsapp-500 hover:bg-whatsapp-600 text-white"
          >
            <PenLine className="w-4 h-4 mr-2" />
            Guardar entrada
          </Button>
        </div>
      </div>

      {/* Weekly Summary */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Resumen de la semana</h2>
        <div className="flex items-end justify-between gap-2 h-24">
          {moods.map((mood) => {
            const count = weekSummary[mood.id];
            const height = count > 0 ? Math.max(20, (count / 5) * 100) : 8;
            return (
              <div key={mood.id} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className={`w-full rounded-t-lg ${mood.color.split(' ')[0]} transition-all`}
                  style={{ height: `${height}%` }}
                />
                <span className="text-xs text-gray-500">{count}</span>
              </div>
            );
          })}
        </div>
        <div className="flex justify-between mt-2 px-2">
          {moods.map((mood) => {
            const Icon = mood.icon;
            return (
              <Icon key={mood.id} className={`w-4 h-4 ${mood.color.split(' ')[1]}`} />
            );
          })}
        </div>
      </div>

      {/* Reminder Card */}
      <div className="bg-whatsapp-50 rounded-2xl p-6 border border-whatsapp-100">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-whatsapp-200 rounded-full flex items-center justify-center flex-shrink-0">
            <Heart className="w-5 h-5 text-whatsapp-600" />
          </div>
          <div>
            <h3 className="font-semibold text-whatsapp-900 mb-1">Un pequeño recordatorio</h3>
            <p className="text-whatsapp-700">
              Escribir regularmente te ayuda a identificar patrones y celebrar tu progreso. No necesitas escribir mucho, solo lo que sientas.
            </p>
          </div>
        </div>
      </div>

      {/* Journal Entries */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Entradas anteriores</h2>
        <div className="space-y-4">
          {entries.map((entry) => {
            const moodInfo = moods.find(m => m.id === entry.mood);
            const MoodIcon = moodInfo?.icon || Meh;
            return (
              <div key={entry.id} className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${moodInfo?.color}`}>
                      <MoodIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">{moodInfo?.label}</span>
                      <p className="text-sm text-gray-500">{entry.date}</p>
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 mb-4">{entry.content}</p>
                <div className="flex gap-2">
                  {entry.tags.map((tag) => (
                    <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ProgresoTab() {
  return (
    <div className="space-y-6">
      {/* Goals */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Mis objetivos</h2>
        <div className="space-y-6">
          {mockGoals.map((goal) => (
            <div key={goal.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {goal.completed ? (
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-green-600" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 bg-whatsapp-100 rounded-full flex items-center justify-center">
                      <Target className="w-4 h-4 text-whatsapp-600" />
                    </div>
                  )}
                  <div>
                    <h3 className={`font-medium ${goal.completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                      {goal.title}
                    </h3>
                    <p className="text-sm text-gray-500">{goal.description}</p>
                  </div>
                </div>
                <span className={`text-sm font-medium ${goal.completed ? 'text-green-600' : 'text-whatsapp-600'}`}>
                  {goal.progress}%
                </span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden ml-9">
                <div
                  className={`h-full rounded-full transition-all ${
                    goal.completed ? 'bg-green-500' : 'bg-whatsapp-500'
                  }`}
                  style={{ width: `${goal.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Milestones */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Logros</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {mockMilestones.map((milestone) => {
            const Icon = milestone.icon;
            return (
              <div
                key={milestone.id}
                className={`p-4 rounded-xl text-center ${
                  milestone.achieved
                    ? 'bg-whatsapp-50 border-2 border-whatsapp-200'
                    : 'bg-gray-50 border-2 border-gray-100 opacity-50'
                }`}
              >
                <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-2 ${
                  milestone.achieved ? 'bg-whatsapp-200' : 'bg-gray-200'
                }`}>
                  <Icon className={`w-6 h-6 ${milestone.achieved ? 'text-whatsapp-600' : 'text-gray-400'}`} />
                </div>
                <p className={`text-sm font-medium ${milestone.achieved ? 'text-whatsapp-700' : 'text-gray-400'}`}>
                  {milestone.title}
                </p>
                {milestone.achieved && (
                  <Check className="w-4 h-4 text-green-500 mx-auto mt-1" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Session History */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Historial de sesiones</h2>
        <div className="space-y-4">
          {[
            { date: '28 Feb 2026', title: 'Sesion 8: Estableciendo limites', notes: 'Trabajamos tecnicas de comunicacion asertiva' },
            { date: '21 Feb 2026', title: 'Sesion 7: Gestion de ansiedad', notes: 'Nuevos ejercicios de respiracion' },
            { date: '14 Feb 2026', title: 'Sesion 6: Patrones de pensamiento', notes: 'Identificamos creencias limitantes' }
          ].map((session, index) => (
            <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
              <div className="w-10 h-10 bg-whatsapp-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Calendar className="w-5 h-5 text-whatsapp-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-medium text-gray-900">{session.title}</h3>
                  <span className="text-sm text-gray-500">{session.date}</span>
                </div>
                <p className="text-sm text-gray-600">{session.notes}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function HistorialTab() {
  const [isEditing, setIsEditing] = useState(false);
  const [history, setHistory] = useState(mockClinicalHistory);
  const [documents, setDocuments] = useState<{ id: string; name: string; date: string; size: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    toast.success('Historial clinico actualizado');
    setIsEditing(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const newDoc = {
      id: Date.now().toString(),
      name: file.name,
      date: new Date().toLocaleDateString('es-CO'),
      size: (file.size / 1024).toFixed(1) + ' KB'
    };
    
    setDocuments([...documents, newDoc]);
    toast.success('Documento subido correctamente');
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <div className="bg-whatsapp-50 rounded-2xl p-6 border border-whatsapp-100">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-whatsapp-200 rounded-full flex items-center justify-center flex-shrink-0">
            <Lock className="w-5 h-5 text-whatsapp-600" />
          </div>
          <div>
            <h3 className="font-semibold text-whatsapp-900 mb-1">Informacion privada y segura</h3>
            <p className="text-whatsapp-700 text-sm">
              Tu historial clinico es completamente privado. Solo tu y tu terapeuta pueden acceder a esta informacion.
              Puedes actualizar estos datos en cualquier momento.
            </p>
          </div>
        </div>
      </div>

      {/* Clinical History Card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Historial Clinico</h2>
          <Button
            variant="outline"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? 'Cancelar' : 'Editar'}
          </Button>
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <div>
              <Label htmlFor="previousDiagnosis">Diagnosticos previos</Label>
              <Input
                id="previousDiagnosis"
                value={history.previousDiagnosis}
                onChange={(e) => setHistory({ ...history, previousDiagnosis: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="currentMedication">Medicacion actual</Label>
              <Input
                id="currentMedication"
                value={history.currentMedication}
                onChange={(e) => setHistory({ ...history, currentMedication: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="allergies">Alergias</Label>
              <Input
                id="allergies"
                value={history.allergies}
                onChange={(e) => setHistory({ ...history, allergies: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="previousTherapy">Terapia previa</Label>
              <Input
                id="previousTherapy"
                value={history.previousTherapy}
                onChange={(e) => setHistory({ ...history, previousTherapy: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="familyHistory">Historia familiar</Label>
              <Input
                id="familyHistory"
                value={history.familyHistory}
                onChange={(e) => setHistory({ ...history, familyHistory: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="notes">Notas adicionales</Label>
              <textarea
                id="notes"
                value={history.notes}
                onChange={(e) => setHistory({ ...history, notes: e.target.value })}
                rows={3}
                className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-whatsapp-500 focus:border-transparent"
              />
            </div>
            <Button onClick={handleSave} className="bg-whatsapp-500 hover:bg-whatsapp-600 text-white">
              Guardar cambios
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Diagnosticos previos</h3>
                <p className="text-gray-900">{history.previousDiagnosis}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Medicacion actual</h3>
                <p className="text-gray-900">{history.currentMedication}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Alergias</h3>
                <p className="text-gray-900">{history.allergies}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Terapia previa</h3>
                <p className="text-gray-900">{history.previousTherapy}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Historia familiar</h3>
                <p className="text-gray-900">{history.familyHistory}</p>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Notas adicionales</h3>
              <p className="text-gray-900">{history.notes}</p>
            </div>
          </div>
        )}
      </div>

      {/* Documents */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Documentos</h2>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          className="hidden"
          id="document-upload"
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
        />
        {documents.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 mb-4">No tienes documentos subidos</p>
            <Button 
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-4 h-4 mr-2" />
              Subir documento
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {documents.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-whatsapp-600" />
                  <div>
                    <p className="font-medium text-gray-900">{doc.name}</p>
                    <p className="text-sm text-gray-500">{doc.date} - {doc.size}</p>
                  </div>
                </div>
              </div>
            ))}
            <Button 
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="mt-4"
            >
              <Upload className="w-4 h-4 mr-2" />
              Subir documento
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function AjustesTab({ user }: { user: { handle?: string } }) {
  const [displayName, setDisplayName] = useState(user.handle || '');
  const [email, setEmail] = useState('');
  const [phrase, setPhrase] = useState('Cada dia es una nueva oportunidad');
  const [anonymousParticipation, setAnonymousParticipation] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [sessionReminders, setSessionReminders] = useState(true);
  const [journalReminders, setJournalReminders] = useState(false);

  return (
    <div className="space-y-6">
      {/* Profile Settings */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Perfil</h2>

        <div className="flex items-center gap-6 mb-6">
          <div className="relative">
            <div className="w-20 h-20 bg-whatsapp-100 rounded-full flex items-center justify-center">
              <span className="text-3xl font-bold text-whatsapp-600">
                {displayName?.[0]?.toUpperCase() || 'U'}
              </span>
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-whatsapp-500 rounded-full flex items-center justify-center text-white shadow-lg">
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <div>
            <p className="font-medium text-gray-900">Foto de perfil</p>
            <p className="text-sm text-gray-500">Solo visible para ti y tu terapeuta</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="displayName">Nombre a mostrar</Label>
            <Input
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Tu nombre o apodo"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="email">Correo electronico</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="phrase">Frase personal</Label>
            <Input
              id="phrase"
              value={phrase}
              onChange={(e) => setPhrase(e.target.value)}
              placeholder="Una frase que te inspire"
              className="mt-1"
            />
          </div>

          <Button className="bg-whatsapp-500 hover:bg-whatsapp-600 text-white">
            Guardar Cambios
          </Button>
        </div>
      </div>

      {/* Privacy Settings */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Privacidad</h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-whatsapp-100 rounded-full flex items-center justify-center">
                <Lock className="w-5 h-5 text-whatsapp-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Participacion anonima por defecto</p>
                <p className="text-sm text-gray-500">Oculta tu nombre en la comunidad</p>
              </div>
            </div>
            <button
              onClick={() => setAnonymousParticipation(!anonymousParticipation)}
              className={`w-12 h-7 rounded-full transition-colors ${
                anonymousParticipation ? 'bg-whatsapp-500' : 'bg-gray-300'
              }`}
            >
              <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform mx-1 ${
                anonymousParticipation ? 'translate-x-5' : ''
              }`} />
            </button>
          </div>

          <Button variant="outline" className="w-full">
            Cambiar Contraseña
          </Button>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Notificaciones</h2>

        <div className="space-y-4">
          {[
            { id: 'email', label: 'Notificaciones por email', description: 'Recibe actualizaciones importantes', icon: Mail, value: emailNotifications, setter: setEmailNotifications },
            { id: 'session', label: 'Recordatorios de sesion', description: '24h y 1h antes de tu cita', icon: Calendar, value: sessionReminders, setter: setSessionReminders },
            { id: 'journal', label: 'Recordatorio de diario', description: 'Un recordatorio diario para escribir', icon: Bell, value: journalReminders, setter: setJournalReminders }
          ].map((setting) => {
            const Icon = setting.icon;
            return (
              <div key={setting.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <Icon className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{setting.label}</p>
                    <p className="text-sm text-gray-500">{setting.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => setting.setter(!setting.value)}
                  className={`w-12 h-7 rounded-full transition-colors ${
                    setting.value ? 'bg-whatsapp-500' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform mx-1 ${
                    setting.value ? 'translate-x-5' : ''
                  }`} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
