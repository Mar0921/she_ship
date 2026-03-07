import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Video,
  MapPin,
  Star,
  Bookmark,
  MessageCircle,
  Check,
  Clock,
  Globe,
  Filter,
  X,
  Send
} from 'lucide-react';
import { Button } from '@/client/components/ui/Button';
import Layout from '@/client/components/Layout';

type QuestionnaireAnswers = {
  supportType: string[];
  modality: string;
  language: string;
  budget: string;
  therapistStyle: string;
  urgency: string;
};

const mockTherapists = [
  {
    id: '1',
    name: 'Dra. Maria Garcia',
    avatar: 'MG',
    specialties: ['Ansiedad', 'Trauma', 'Relaciones'],
    description: 'Psicologa clinica con 12 años de experiencia. Enfoque integrativo con especializacion en trauma y relaciones.',
    modalities: ['online', 'presencial'],
    languages: ['Español', 'Ingles'],
    experience: 12,
    priceRange: '50-70€',
    rating: 4.9,
    reviews: 127,
    availability: 'Disponible esta semana',
    location: 'Madrid',
    style: 'formal'
  },
  {
    id: '2',
    name: 'Dra. Laura Martinez',
    avatar: 'LM',
    specialties: ['Depresion', 'Ansiedad', 'Autoestima'],
    description: 'Especialista en terapia cognitivo-conductual. Mi enfoque se centra en ayudarte a desarrollar herramientas practicas.',
    modalities: ['online'],
    languages: ['Español', 'Catalan'],
    experience: 8,
    priceRange: '40-55€',
    rating: 4.8,
    reviews: 89,
    availability: 'Disponible mañana',
    location: 'Barcelona',
    style: 'directo'
  },
  {
    id: '3',
    name: 'Dra. Carmen Ruiz',
    avatar: 'CR',
    specialties: ['Violencia de genero', 'Trauma', 'TEPT'],
    description: 'Psicologa especializada en violencia de genero y trauma. Espacio seguro y libre de juicios.',
    modalities: ['online', 'presencial'],
    languages: ['Español'],
    experience: 15,
    priceRange: '60-80€',
    rating: 5.0,
    reviews: 156,
    availability: 'Disponible esta semana',
    location: 'Valencia',
    style: 'formal'
  },
  {
    id: '4',
    name: 'Dra. Ana Fernandez',
    avatar: 'AF',
    specialties: ['Acoso laboral', 'Estres', 'Burnout'],
    description: 'Experta en psicologia laboral y manejo del estres. Te ayudo a recuperar el equilibrio en tu vida.',
    modalities: ['online'],
    languages: ['Español', 'Ingles'],
    experience: 10,
    priceRange: '45-65€',
    rating: 4.7,
    reviews: 72,
    availability: 'Proxima semana',
    location: 'Sevilla',
    style: 'directo'
  },
  {
    id: '5',
    name: 'Dra. Sofia Lopez',
    avatar: 'SL',
    specialties: ['Ansiedad', 'Autoestima', 'Relaciones'],
    description: 'Ofrezco sesiones solidarias para mujeres en situacion vulnerable. Enfoque humanista y empatico.',
    modalities: ['online'],
    languages: ['Español'],
    experience: 6,
    priceRange: 'Gratuito',
    rating: 4.9,
    reviews: 45,
    availability: 'Disponible esta semana',
    location: 'Madrid',
    style: 'formal'
  }
];

export default function TerapeutasPage() {
  const [showResults, setShowResults] = useState(false);
  const [answers, setAnswers] = useState<QuestionnaireAnswers | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [currentAnswers, setCurrentAnswers] = useState<Partial<QuestionnaireAnswers>>({
    supportType: []
  });

  const handleQuestionnaireComplete = (finalAnswers: QuestionnaireAnswers) => {
    setAnswers(finalAnswers);
    setShowResults(true);
  };

  const handleBack = () => {
    setShowResults(false);
    setCurrentStep(1);
  };

  return (
    <Layout>
      <div className="bg-gray-50 min-h-[calc(100vh-64px)]">
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {showResults ? (
            <TherapistResults answers={answers!} onBack={handleBack} />
          ) : (
            <Questionnaire
              currentStep={currentStep}
              setCurrentStep={setCurrentStep}
              currentAnswers={currentAnswers}
              setCurrentAnswers={setCurrentAnswers}
              onComplete={handleQuestionnaireComplete}
            />
          )}
        </main>
      </div>
    </Layout>
  );
}

interface QuestionnaireProps {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  currentAnswers: Partial<QuestionnaireAnswers>;
  setCurrentAnswers: (answers: Partial<QuestionnaireAnswers>) => void;
  onComplete: (answers: QuestionnaireAnswers) => void;
}

function Questionnaire({
  currentStep,
  setCurrentStep,
  currentAnswers,
  setCurrentAnswers,
  onComplete
}: QuestionnaireProps) {
  const totalSteps = 6;
  const progress = (currentStep / totalSteps) * 100;

  const questions = [
    {
      title: '¿Que tipo de apoyo estas buscando?',
      subtitle: 'Puedes seleccionar varias opciones',
      options: [
        { value: 'ansiedad', label: 'Ansiedad o estres' },
        { value: 'depresion', label: 'Tristeza o depresion' },
        { value: 'acoso', label: 'Acoso' },
        { value: 'relaciones', label: 'Relaciones abusivas' },
        { value: 'trauma', label: 'Trauma' },
        { value: 'otro', label: 'Otro' }
      ],
      multiple: true,
      key: 'supportType' as const
    },
    {
      title: '¿Como prefieres las sesiones?',
      subtitle: 'Selecciona tu modalidad preferida',
      options: [
        { value: 'online', label: 'Online (videollamada)' },
        { value: 'presencial', label: 'Presencial' },
        { value: 'ambas', label: 'Ambas opciones' }
      ],
      multiple: false,
      key: 'modality' as const
    },
    {
      title: '¿En que idioma prefieres las sesiones?',
      subtitle: 'Selecciona tu idioma preferido',
      options: [
        { value: 'español', label: 'Español' },
        { value: 'catalan', label: 'Catalan' },
        { value: 'ingles', label: 'Ingles' },
        { value: 'sin-preferencia', label: 'Sin preferencia' }
      ],
      multiple: false,
      key: 'language' as const
    },
    {
      title: '¿Cual es tu presupuesto por sesion?',
      subtitle: 'Esto nos ayuda a mostrarte opciones adecuadas',
      options: [
        { value: 'sin-presupuesto', label: 'Sin presupuesto / Gratuito' },
        { value: 'hasta-40', label: 'Hasta 40€' },
        { value: '40-70', label: '40€ - 70€' },
        { value: 'mas-70', label: 'Mas de 70€' },
        { value: 'sin-limite', label: 'Sin limite de presupuesto' }
      ],
      multiple: false,
      key: 'budget' as const
    },
    {
      title: '¿Como te gustaria que fuera tu profesional?',
      subtitle: 'Elige el estilo de comunicacion que prefieres',
      options: [
        { value: 'formal', label: 'Formal y estructurado' },
        { value: 'directo', label: 'Directo y practico' },
        { value: 'cercano', label: 'Cercano y empatico' },
        { value: 'sin-preferencia', label: 'Sin preferencia' }
      ],
      multiple: false,
      key: 'therapistStyle' as const
    },
    {
      title: '¿Con que urgencia necesitas apoyo?',
      subtitle: 'Nos ayuda a priorizar tu busqueda',
      options: [
        { value: 'urgente', label: 'Lo antes posible' },
        { value: 'pronto', label: 'En las proximas semanas' },
        { value: 'explorando', label: 'Estoy explorando opciones' }
      ],
      multiple: false,
      key: 'urgency' as const
    }
  ];

  const currentQuestion = questions[currentStep - 1];

  const handleOptionSelect = (value: string) => {
    if (currentQuestion.multiple) {
      const current = currentAnswers.supportType || [];
      const updated = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value];
      setCurrentAnswers({ ...currentAnswers, supportType: updated });
    } else {
      setCurrentAnswers({ ...currentAnswers, [currentQuestion.key]: value });
    }
  };

  const isOptionSelected = (value: string) => {
    if (currentQuestion.multiple) {
      return (currentAnswers.supportType || []).includes(value);
    }
    return currentAnswers[currentQuestion.key] === value;
  };

  const canProceed = () => {
    if (currentQuestion.multiple) {
      return (currentAnswers.supportType || []).length > 0;
    }
    return !!currentAnswers[currentQuestion.key];
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(currentAnswers as QuestionnaireAnswers);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
          <span>Pregunta {currentStep} de {totalSteps}</span>
          <span>{Math.round(progress)}% completado</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-purple-600 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question card */}
      <div className="bg-white rounded-2xl shadow-sm p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {currentQuestion.title}
        </h2>
        <p className="text-gray-500 mb-8">{currentQuestion.subtitle}</p>

        <div className="space-y-3 mb-8">
          {currentQuestion.options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleOptionSelect(option.value)}
              className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                isOptionSelected(option.value)
                  ? 'border-purple-600 bg-purple-50'
                  : 'border-gray-200 hover:border-purple-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`font-medium ${
                  isOptionSelected(option.value) ? 'text-purple-700' : 'text-gray-700'
                }`}>
                  {option.label}
                </span>
                {isOptionSelected(option.value) && (
                  <Check className="w-5 h-5 text-purple-600" />
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="text-gray-600"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Anterior
          </Button>

          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            {currentStep === totalSteps ? 'Ver resultados' : 'Siguiente'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}

interface TherapistResultsProps {
  answers: QuestionnaireAnswers;
  onBack: () => void;
}

function TherapistResults({ onBack }: TherapistResultsProps) {
  const [modalityFilter, setModalityFilter] = useState<string>('todas');
  const [sortBy, setSortBy] = useState<string>('recomendados');
  const [contactModal, setContactModal] = useState<typeof mockTherapists[0] | null>(null);

  const filteredTherapists = mockTherapists.filter(therapist => {
    if (modalityFilter === 'online') {
      return therapist.modalities.includes('online');
    }
    if (modalityFilter === 'presencial') {
      return therapist.modalities.includes('presencial');
    }
    return true;
  });

  const sortedTherapists = [...filteredTherapists].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'experiencia':
        return b.experience - a.experience;
      case 'precio':
        return parseInt(a.priceRange) - parseInt(b.priceRange);
      default:
        return 0;
    }
  });

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <button
            onClick={onBack}
            className="flex items-center text-purple-600 hover:text-purple-700 mb-2"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Modificar preferencias
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            Terapeutas recomendadas para ti
          </h1>
          <p className="text-gray-500">
            {sortedTherapists.length} profesionales encontradas
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 mb-6 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600">Filtrar:</span>
        </div>

        <div className="flex items-center gap-2">
          {['todas', 'online', 'presencial'].map((filter) => (
            <button
              key={filter}
              onClick={() => setModalityFilter(filter)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                modalityFilter === filter
                  ? 'bg-purple-100 text-purple-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {filter === 'todas' ? 'Todas' : filter === 'online' ? 'Solo Online' : 'Solo Presencial'}
            </button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <span className="text-sm text-gray-600">Ordenar por:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 bg-gray-100 rounded-lg text-sm text-gray-700 border-0 focus:ring-2 focus:ring-purple-500"
          >
            <option value="recomendados">Recomendados</option>
            <option value="rating">Mejor valorados</option>
            <option value="experiencia">Mas experiencia</option>
            <option value="precio">Menor precio</option>
          </select>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-4">
        {sortedTherapists.map((therapist) => (
          <TherapistCard
            key={therapist.id}
            therapist={therapist}
            onContact={() => setContactModal(therapist)}
          />
        ))}
      </div>

      {/* Contact Modal */}
      {contactModal && (
        <ContactModal
          therapist={contactModal}
          onClose={() => setContactModal(null)}
        />
      )}
    </div>
  );
}

interface TherapistCardProps {
  therapist: typeof mockTherapists[0];
  onContact: () => void;
}

function TherapistCard({ therapist, onContact }: TherapistCardProps) {
  const [saved, setSaved] = useState(false);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex gap-6">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-purple-600">{therapist.avatar}</span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{therapist.name}</h3>
              <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {therapist.experience} años exp.
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {therapist.location}
                </span>
              </div>
            </div>
            <button
              onClick={() => setSaved(!saved)}
              className={`p-2 rounded-full transition-colors ${
                saved ? 'text-purple-600 bg-purple-100' : 'text-gray-400 hover:text-purple-600'
              }`}
            >
              <Bookmark className={`w-5 h-5 ${saved ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Specialties */}
          <div className="flex flex-wrap gap-2 mb-3">
            {therapist.specialties.map((specialty) => (
              <span
                key={specialty}
                className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm"
              >
                {specialty}
              </span>
            ))}
          </div>

          <p className="text-gray-600 text-sm mb-4">{therapist.description}</p>

          {/* Details row */}
          <div className="flex flex-wrap items-center gap-4 text-sm mb-4">
            <div className="flex items-center gap-2">
              {therapist.modalities.includes('online') && (
                <span className="flex items-center gap-1 text-gray-600">
                  <Video className="w-4 h-4" />
                  Online
                </span>
              )}
              {therapist.modalities.includes('presencial') && (
                <span className="flex items-center gap-1 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  Presencial
                </span>
              )}
            </div>
            <span className="text-gray-300">|</span>
            <span className="flex items-center gap-1 text-gray-600">
              <Globe className="w-4 h-4" />
              {therapist.languages.join(', ')}
            </span>
            <span className="text-gray-300">|</span>
            <span className={`font-medium ${therapist.priceRange === 'Gratuito' ? 'text-green-600' : 'text-gray-900'}`}>
              {therapist.priceRange === 'Gratuito' ? 'Gratuito' : `${therapist.priceRange}/sesion`}
            </span>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span className="font-semibold text-gray-900">{therapist.rating}</span>
                <span className="text-gray-500">({therapist.reviews} reseñas)</span>
              </div>
              <span className="text-green-600 text-sm font-medium">
                {therapist.availability}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Button
                onClick={onContact}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Contactar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ContactModalProps {
  therapist: typeof mockTherapists[0];
  onClose: () => void;
}

function ContactModal({ therapist, onClose }: ContactModalProps) {
  const navigate = useNavigate();

  const handleStartChat = () => {
    // Navigate to chat with this therapist
    navigate(`/chat/${therapist.id}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-lg font-bold text-purple-600">{therapist.avatar}</span>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Contactar a {therapist.name}</h2>
              <p className="text-sm text-gray-500">{therapist.specialties.slice(0, 2).join(', ')}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-10 h-10 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Inicia una conversacion
            </h3>
            <p className="text-gray-600">
              Podras enviar mensajes y recibir respuestas de {therapist.name} directamente en el chat.
            </p>
          </div>

          <div className="bg-purple-50 rounded-xl p-4 mb-6">
            <p className="text-sm text-purple-700">
              <strong>Nota:</strong> La terapeuta suele responder en un plazo de 24-48 horas habiles.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button
              onClick={handleStartChat}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Send className="w-4 h-4 mr-2" />
              Ir al chat
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
