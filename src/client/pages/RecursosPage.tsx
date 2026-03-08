import { useState } from 'react';
import {
  Phone,
  Search,
  BookOpen,
  Video,
  Headphones,
  FileText,
  Brain,
  Shield,
  AlertTriangle,
  Heart,
  Users,
  Star,
  Clock,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/client/components/ui/Button';
import Layout from '@/client/components/Layout';

type ResourceCategory = 'todos' | 'ansiedad' | 'relaciones' | 'acoso' | 'trauma' | 'bienestar';
type ResourceType = 'articulo' | 'guia' | 'video' | 'audio';

type Resource = {
  id: string;
  title: string;
  description: string;
  type: ResourceType;
  category: ResourceCategory;
  readTime: string;
  featured: boolean;
  url?: string;
};

const emergencyLines = [
  {
    number: '(0057) 604 60 42 784',
    name: 'Telefono de la Esperanza',
    description: 'Atencion las 24 horas, todos los dias',
    color: 'bg-red-50 border-red-200 text-red-700'
  },
  {
    number: '(0057) 323 2425',
    name: 'Telefono de la Esperanza',
    description: 'Ayuda emocional',
    color: 'bg-red-50 border-red-200 text-red-700'
  },
  {
    number: '(0057) 284 6600',
    name: 'Telefono de la Esperanza',
    description: 'Ayuda emocional',
    color: 'bg-red-50 border-red-200 text-red-700'
  },
  {
    number: '123',
    name: 'Linea unica de emergencias Nacional',
    description: 'Para situaciones de emergencia inmediata',
    color: 'bg-orange-50 border-orange-200 text-orange-700'
  },
  {
    number: '01 8000 112 137',
    name: 'Linea Purpura Bogota',
    description: 'Linea gratuita',
    color: 'bg-purple-50 border-purple-200 text-purple-700'
  }
];

const mockResources: Resource[] = [
  {
    id: '1',
    title: 'Practicas de respiración',
    description: 'Aprende ejercicios practicos de respiracion que puedes usar en cualquier momento para calmar la ansiedad.',
    type: 'articulo',
    category: 'ansiedad',
    readTime: '5 min',
    featured: true,
    url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC10741869/'
  },
  {
    id: '2',
    title: 'Características de las relaciones tóxicas',
    description: 'Señales de alerta y patrones comunes en relaciones que pueden ser dañinas para tu bienestar emocional.',
    type: 'guia',
    category: 'relaciones',
    readTime: '10 min',
    featured: true,
    url: 'https://www.psicoglobal.com/blog/relacion-toxica-senales-identificarla'
  },
  {
    id: '3',
    title: 'Meditación guiada',
    description: 'Una sesion de 15 minutos para iniciarte en la practica de la meditacion mindfulness.',
    type: 'audio',
    category: 'bienestar',
    readTime: '15 min',
    featured: true,
    url: 'https://www.youtube.com/watch?v=3oCC4NDgYrY'
  },
  {
    id: '4',
    title: 'Trauma Post Aborto',
    description: 'Informacion sobre el sindrome post aborto y como manejar este tipo de trauma emocional.',
    type: 'articulo',
    category: 'trauma',
    readTime: '8 min',
    featured: false,
    url: 'https://www.redmadre.es/te-apoyamos/pensando-en-abortar/el-sindrome-post-aborto/'
  },
  {
    id: '5',
    title: 'Mujeres en el trabajo: Tus derechos respaldados por la ley',
    description: 'Guia legal practica sobre los derechos laborales de las mujeres en Colombia.',
    type: 'guia',
    category: 'acoso',
    readTime: '12 min',
    featured: false,
    url: 'https://www.solucioneslegales.net.co/blog/derechos-laborales-de-las-mujeres-en-colombia'
  },
  {
    id: '6',
    title: 'Transtorno de estrés postraumático',
    description: 'Informacion sobre el TEPT, sintomas y opciones de tratamiento.',
    type: 'articulo',
    category: 'trauma',
    readTime: '8 min',
    featured: false,
    url: 'https://adaa.org/understanding-anxiety/posttraumatic-stress-disorder-ptsd'
  },
  {
    id: '7',
    title: 'Cómo poner (y no poner) límites',
    description: 'Aprende a establecer limites saludables en tus relaciones personales y profesionales.',
    type: 'video',
    category: 'relaciones',
    readTime: '20 min',
    featured: false,
    url: 'https://www.youtube.com/watch?v=5k4WmFb0al4&t=1s'
  },
  {
    id: '8',
    title: 'Marco legal del aborto en Colombia',
    description: 'Conoce la normativa vigente sobre el aborto en Colombia.',
    type: 'guia',
    category: 'trauma',
    readTime: '15 min',
    featured: false,
    url: 'https://despenalizaciondelaborto.org.co/marco-legal-para-el-aborto-en-colombia/'
  },
  {
    id: '9',
    title: 'Guía de implementación de medidas de protección para mujeres víctimas de violencia',
    description: 'Guia completa sobre medidas de proteccion y atencion para mujeres victimas de violencias basadas en genero.',
    type: 'guia',
    category: 'acoso',
    readTime: '30 min',
    featured: false,
    url: 'https://www.sismamujer.org/wp-content/uploads/2022/06/GUIA-DE-IMPLEMENTACION-DIGITAL-1-de-junio-2022-1.pdf'
  },
  {
    id: '10',
    title: 'Más sobre el aborto',
    description: 'Asesoria sobre aborto legal gratis en Colombia.',
    type: 'articulo',
    category: 'trauma',
    readTime: '5 min',
    featured: false,
    url: 'https://despenalizaciondelaborto.org.co/asesoria-de-aborto-legal-gratis/'
  }
];

const categories = [
  { id: 'todos', label: 'Todos', icon: BookOpen, count: mockResources.length },
  { id: 'ansiedad', label: 'Ansiedad', icon: Brain, count: mockResources.filter(r => r.category === 'ansiedad').length },
  { id: 'relaciones', label: 'Relaciones', icon: Heart, count: mockResources.filter(r => r.category === 'relaciones').length },
  { id: 'acoso', label: 'Acoso', icon: Shield, count: mockResources.filter(r => r.category === 'acoso').length },
  { id: 'trauma', label: 'Trauma', icon: AlertTriangle, count: mockResources.filter(r => r.category === 'trauma').length },
  { id: 'bienestar', label: 'Bienestar', icon: Users, count: mockResources.filter(r => r.category === 'bienestar').length }
] as const;

const typeIcons = {
  articulo: FileText,
  guia: BookOpen,
  video: Video,
  audio: Headphones
};

const typeLabels = {
  articulo: 'Articulo',
  guia: 'Guia',
  video: 'Video',
  audio: 'Audio'
};

export default function RecursosPage() {
  const [selectedCategory, setSelectedCategory] = useState<ResourceCategory>('todos');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredResources = mockResources.filter(resource => {
    const matchesCategory = selectedCategory === 'todos' || resource.category === selectedCategory;
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredResources = mockResources.filter(r => r.featured);

  return (
    <Layout>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Emergency Banner */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <Phone className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Lineas de ayuda</h2>
              <p className="text-sm text-gray-500">Disponibles las 24 horas</p>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {emergencyLines.map((line) => (
              <div
                key={line.number}
                className={`p-4 rounded-xl border-2 ${line.color}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold">{line.number}</span>
                  <Phone className="w-5 h-5" />
                </div>
                <p className="font-medium">{line.name}</p>
                <p className="text-sm opacity-80">{line.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-6">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar recursos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-whatsapp-500 focus:border-transparent"
                />
              </div>

              {/* Categories */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-4">Categorias</h3>
                <nav className="space-y-2">
                  {categories.map((category) => {
                    const Icon = category.icon;
                    const isActive = selectedCategory === category.id;
                    return (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id as ResourceCategory)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-colors ${
                          isActive
                            ? 'bg-whatsapp-100 text-whatsapp-700'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="w-4 h-4" />
                          <span className="font-medium">{category.label}</span>
                        </div>
                        <span className={`text-sm ${isActive ? 'text-whatsapp-600' : 'text-gray-400'}`}>
                          {category.count}
                        </span>
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Mobile search */}
            <div className="lg:hidden mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar recursos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-whatsapp-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Featured Resources */}
            {selectedCategory === 'todos' && !searchQuery && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Destacados</h2>
                <div className="grid md:grid-cols-3 gap-4">
                  {featuredResources.map((resource) => (
                    <ResourceCard key={resource.id} resource={resource} featured />
                  ))}
                </div>
              </div>
            )}

            {/* Mobile category selector */}
            <div className="lg:hidden mb-4 overflow-x-auto">
              <div className="flex gap-2 pb-2">
                {categories.map((category) => {
                  const Icon = category.icon;
                  const isActive = selectedCategory === category.id;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id as ResourceCategory)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                        isActive
                          ? 'bg-whatsapp-500 text-white'
                          : 'bg-white text-gray-600 border border-gray-200'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {category.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* All Resources */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {selectedCategory === 'todos' ? 'Todos los recursos' : categories.find(c => c.id === selectedCategory)?.label}
              </h2>

              {filteredResources.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-4">
                  {filteredResources.map((resource) => (
                    <ResourceCard key={resource.id} resource={resource} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-2xl">
                  <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No se encontraron recursos
                  </h3>
                  <p className="text-gray-500">
                    Intenta con otra busqueda o categoria
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}

interface ResourceCardProps {
  resource: Resource;
  featured?: boolean;
}

function ResourceCard({ resource, featured }: ResourceCardProps) {
  const TypeIcon = typeIcons[resource.type];
  const categoryInfo = categories.find(c => c.id === resource.category);
  const CategoryIcon = categoryInfo?.icon || BookOpen;

  return (
    <div className={`bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow ${
      featured ? 'border-2 border-whatsapp-100' : ''
    }`}>
      {featured && (
        <div className="flex items-center gap-1 text-whatsapp-600 text-sm font-medium mb-3">
          <Star className="w-4 h-4 fill-current" />
          Destacado
        </div>
      )}

      <div className="flex items-center gap-2 mb-3">
        <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600">
          <TypeIcon className="w-3 h-3" />
          {typeLabels[resource.type]}
        </div>
        <div className="flex items-center gap-1 text-sm text-gray-500">
          <Clock className="w-3 h-3" />
          {resource.readTime}
        </div>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mb-2">{resource.title}</h3>
      <p className="text-gray-600 text-sm mb-4">{resource.description}</p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-sm text-gray-500">
          <CategoryIcon className="w-4 h-4" />
          {categoryInfo?.label}
        </div>
        <Button 
          variant="ghost" 
          className="text-whatsapp-600 hover:text-whatsapp-700 hover:bg-whatsapp-50"
          onClick={() => resource.url && window.open(resource.url, '_blank')}
        >
          Leer mas
          <ExternalLink className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
