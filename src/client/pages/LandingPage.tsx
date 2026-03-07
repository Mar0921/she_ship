import { Link } from 'react-router-dom';
import {
  Shield,
  Heart,
  Users,
  BookOpen,
  Video,
  Sparkles,
  ArrowRight,
  Check,
  Lock
} from 'lucide-react';
import { Button } from '@/client/components/ui/Button';
import Layout from '@/client/components/Layout';

export default function LandingPage() {
  return (
    <Layout>
      <HeroSection />
      <PlatformDescriptionSection />
      <FeaturesPreviewSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <CTASection />
    </Layout>
  );
}

function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-purple-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Shield className="w-4 h-4" />
            Espacio seguro y confidencial
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
            Tu bienestar emocional
            <span className="text-purple-600"> merece atención</span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            PurpleMatch es una plataforma diseñada para acompañarte en tu viaje hacia el bienestar emocional. 
            Conecta con profesionales, únete a una comunidad de apoyo y accede a recursos diseñados para ti.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link to="/signup">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 text-lg rounded-xl w-full sm:w-auto">
                Registrarse
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" className="border-purple-200 text-purple-700 hover:bg-purple-50 px-8 py-6 text-lg rounded-xl w-full sm:w-auto">
                Iniciar Sesión
              </Button>
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-500" />
              <span>Profesionales verificados</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-500" />
              <span>100% confidencial</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-500" />
              <span>Anonimato opcional</span>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-purple-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl" />
    </section>
  );
}

function PlatformDescriptionSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
          ¿Qué es PurpleMatch?
        </h2>
        <p className="text-lg text-gray-600 leading-relaxed">
          PurpleMatch es una plataforma de bienestar emocional que te acompaña en cada paso de tu proceso. 
          <strong> No estás sola </strong> - aquí encontrarás profesionales capacitados, una comunidad que te entiende 
          y recursos diseñados para ayudarte a crecer.
        </p>
        <p className="text-lg text-gray-600 mt-4 leading-relaxed">
          Creemos que cada mujer merece acceso a apoyo emocional de calidad en un entorno seguro, 
          libre de juicios y adaptado a sus necesidades únicas.
        </p>
      </div>
    </section>
  );
}

function FeaturesPreviewSection() {
  const features = [
    {
      icon: Video,
      title: 'Terapeutas',
      description: 'Encuentra profesionales de salud mental verificados especializados en diferentes áreas. Nuestro sistema de búsqueda te ayuda a conectar con terapeutas que entienden tu contexto y necesidades específicas.',
      preview: [
        'Profesionales verificados y licenciados',
        'Especialidades diversas (ansiedad, depresión, relaciones)',
        'Sesiones online y presenciales',
        'Primera consulta de evaluación'
      ],
      color: 'bg-purple-100 text-purple-600',
      badge: 'Próximamente'
    },
    {
      icon: Users,
      title: 'Comunidad',
      description: 'Un espacio seguro donde puedes compartir experiencias con otras mujeres que están en el mismo camino. Nuestra comunidad está moderada para garantizar un ambiente de apoyo y respeto.',
      preview: [
        'Foros de discusión temáticos',
        'Grupos de apoyo por experiencia',
        'Compartición anónima opcional',
        'Moderación activa 24/7'
      ],
      color: 'bg-pink-100 text-pink-600',
      badge: 'Próximamente'
    },
    {
      icon: BookOpen,
      title: 'Recursos de Apoyo',
      description: 'Accede a contenido educativo, guías prácticas y líneas de emergencia cuando más lo necesites. tenemos recursos para cada etapa de tu proceso de bienestar emocional.',
      preview: [
        'Artículos y guías educativas',
        'Ejercicios de autoconocimiento',
        'Líneas de emergencia disponibles',
        'Contenido actualizado regularmente'
      ],
      color: 'bg-violet-100 text-violet-600',
      badge: 'Próximamente'
    }
  ];

  return (
    <section className="py-20 bg-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Lo que encontrarás al registrarte
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Descubre todas las herramientas de apoyo que tenemos disponibles para ti.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div 
              key={feature.title}
              className="bg-white rounded-2xl p-8 shadow-sm border border-purple-100"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-14 h-14 ${feature.color} rounded-xl flex items-center justify-center`}>
                  <feature.icon className="w-7 h-7" />
                </div>
                <span className="text-xs font-medium text-purple-600 bg-purple-100 px-3 py-1 rounded-full">
                  {feature.badge}
                </span>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 text-sm mb-6">{feature.description}</p>
              
              <div className="space-y-3">
                {feature.preview.map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-600">{item}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
                  <Lock className="w-4 h-4" />
                  Disponible al registrarte
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  const steps = [
    {
      number: '01',
      title: 'Regístrate',
      description: 'Crea tu cuenta en minutos. Solo necesitas un correo electrónico.'
    },
    {
      number: '02',
      title: 'Explora',
      description: 'Descubre los profesionales, comunidad y recursos disponibles.'
    },
    {
      number: '03',
      title: 'Conecta',
      description: 'Elige la opción de apoyo que mejor se adapte a tus necesidades.'
    },
    {
      number: '04',
      title: 'Crece',
      description: 'Comienza tu proceso de bienestar emocional a tu propio ritmo.'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            ¿Cómo funciona?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Un proceso sencillo diseñado para que te sientas cómoda en cada paso.
          </p>
        </div>

        <div className="relative">
          {/* Connection line for desktop */}
          <div className="hidden lg:block absolute top-12 left-1/2 -translate-x-1/2 w-3/4 h-0.5 bg-purple-200" />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step) => (
              <div key={step.number} className="relative text-center">
                <div className="relative inline-flex items-center justify-center w-24 h-24 bg-purple-50 rounded-full mb-6 z-10">
                  <span className="text-2xl font-bold text-purple-600">{step.number}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  const testimonials = [
    {
      quote: 'PurpleMatch me dio las herramientas para entender mis emociones y trabajar en mi bienestar. Saber que hay un espacio diseñado para mujeres como yo marcó la diferencia.',
      author: 'Luna',
      membership: 'Usuario verificado'
    },
    {
      quote: 'La idea de tener profesionales especializados y una comunidad que te entiende sin juzgar es innovadora. Ojalá hubiera existido antes.',
      author: 'Estrella',
      membership: 'Usuario verificado'
    },
    {
      quote: 'Poder acceder a recursos y saber que hay profesionales disponibles cuando los necesito me da tranquilidad. Es un apoyo constante.',
      author: 'Aurora',
      membership: 'Usuario verificado'
    }
  ];

  return (
    <section className="py-20 bg-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Lo que dicen nuestras usuarias
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Mujeres que han encontrado en PurpleMatch un espacio de apoyo y crecimiento.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.author} className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Sparkles key={i} className="w-4 h-4 text-purple-400" />
                ))}
              </div>
              <blockquote className="text-gray-700 mb-6 italic">
                "{testimonial.quote}"
              </blockquote>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-200 rounded-full flex items-center justify-center">
                  <span className="text-purple-700 font-semibold">{testimonial.author[0]}</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{testimonial.author}</p>
                  <p className="text-sm text-gray-500">{testimonial.membership}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-20 bg-purple-600">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <Heart className="w-8 h-8 text-white" />
          </div>
        </div>

        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          Tu bienestar es nuestra prioridad
        </h2>
        <p className="text-lg text-purple-100 mb-10 max-w-2xl mx-auto">
          Da el primer paso hacia una mejor versión de ti. Estamos aquí para acompañarte en tu journey hacia el bienestar emocional.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/signup">
            <Button className="bg-white text-purple-600 hover:bg-purple-50 px-8 py-6 text-lg rounded-xl w-full sm:w-auto">
              Crear Mi Cuenta
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8 py-6 text-lg rounded-xl w-full sm:w-auto">
              Ya tengo cuenta
            </Button>
          </Link>
        </div>

        <div className="mt-10 flex items-center justify-center gap-2 text-purple-200 text-sm">
          <Lock className="w-4 h-4" />
          <span>Tu información está segura con nosotros</span>
        </div>
      </div>
    </section>
  );
}
