import { Link } from 'react-router-dom';
import { Heart, Phone, Shield, ExternalLink, MessageCircle, Instagram, Twitter, Facebook } from 'lucide-react';
import { useAuth } from '@/client/lib/auth';

const emergencyLines = [
  {
    number: '(0057) 604 60 42 784',
    name: 'Telefono de la Esperanza',
    description: '24h, gratuita',
    highlight: true
  },
  {
    number: '(0057) 323 2425',
    name: 'Telefono de la Esperanza',
    description: '24h, gratuita'
  },
  {
    number: '(0057) 284 6600',
    name: 'Telefono de la Esperanza',
    description: '24h, gratuita'
  },
  {
    number: '123',
    name: 'Linea unica de emergencias Nacional',
    description: 'Emergencias'
  },
  {
    number: '01 8000 112 137',
    name: 'Linea Purpura Bogota',
    description: 'Linea gratuita'
  }
];

const platformLinks = [
  { href: '/login?redirect=/terapeutas', label: 'Encontrar Terapeuta' },
  { href: '/login?redirect=/comunidad', label: 'Comunidad' },
  { href: '/login?redirect=/recursos', label: 'Recursos' },
  { href: '/login?redirect=/perfil', label: 'Mi Espacio' }
];

const legalLinks = [
  { href: '/terms', label: 'Terminos de uso' },
  { href: '/privacy', label: 'Politica de privacidad' },
  { href: '/cookies', label: 'Politica de cookies' }
];

const WHATSAPP_NUMBER = '573001234567';
const WHATSAPP_MESSAGE = encodeURIComponent('Hola, necesito apoyo emocional. ¿Pueden ayudarme?');

export default function Footer() {
  const { user } = useAuth();

  // Get the correct redirect URL based on user role
  const getDashboardUrl = () => {
    if (user?.role === 'professional') return '/dashboard-profesional';
    if (user?.role === 'admin') return '/admin';
    if (user?.role === 'user') return '/home';
    return '/';
  };

  return (
    <footer className="bg-gradient-to-b from-purple-900 to-purple-950 text-purple-300">
      {/* WhatsApp CTA Banner */}
      <div className="bg-whatsapp-500/10 border-b border-whatsapp-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-whatsapp-500 rounded-full flex items-center justify-center shadow-lg shadow-whatsapp-500/30">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-white font-bold text-lg">Línea de Apoyo WhatsApp</p>
                <p className="text-whatsapp-300 text-sm">Disponible 24h · Confidencial · Gratuita</p>
              </div>
            </div>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-whatsapp-500 hover:bg-whatsapp-400 text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
            >
              <MessageCircle className="w-5 h-5" />
              Escribir ahora
            </a>
          </div>
        </div>
      </div>

      {/* Emergency Banner */}
      <div className="bg-red-900/20 border-b border-red-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center animate-pulse">
                <Phone className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white font-semibold">Línea 155, ayuda y orientación para mujeres</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              {emergencyLines.slice(1).map((line) => (
                <div key={line.number} className="text-center">
                  <p className="text-white font-bold">{line.number}</p>
                  <p className="text-xs text-purple-400">{line.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to={getDashboardUrl()} className="flex items-center gap-2 mb-4">
              <img src="/logo.png" className="w-10 h-10 object-contain" />
              <span className="text-xl font-bold text-white">PurpleMatch</span>
            </Link>
            <p className="text-sm mb-6 text-purple-300 leading-relaxed">
              Plataforma de acompañamiento emocional y psicologico diseñada exclusivamente para mujeres. Un espacio seguro y confidencial.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3 mb-4">
              <a href="#" className="w-8 h-8 bg-purple-800 hover:bg-purple-600 rounded-lg flex items-center justify-center transition-colors">
                <Instagram className="w-4 h-4 text-purple-200" />
              </a>
              <a href="#" className="w-8 h-8 bg-purple-800 hover:bg-purple-600 rounded-lg flex items-center justify-center transition-colors">
                <Twitter className="w-4 h-4 text-purple-200" />
              </a>
              <a href="#" className="w-8 h-8 bg-purple-800 hover:bg-purple-600 rounded-lg flex items-center justify-center transition-colors">
                <Facebook className="w-4 h-4 text-purple-200" />
              </a>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-whatsapp-600 hover:bg-whatsapp-500 rounded-lg flex items-center justify-center transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-white" />
              </a>
            </div>

            <div className="flex items-center gap-2 px-3 py-2 bg-purple-800/50 rounded-lg border border-purple-700/50">
              <Shield className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-purple-300">Datos Protegidos</span>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Plataforma</h4>
            <ul className="space-y-3">
              {platformLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-purple-300 hover:text-purple-100 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help Lines */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Lineas de Ayuda</h4>
            <ul className="space-y-3">
              {emergencyLines.map((line) => (
                <li key={line.number} className="flex items-start gap-2">
                  <span className={`font-bold ${line.highlight ? 'text-red-400' : 'text-purple-400'}`}>
                    {line.number}
                  </span>
                  <div>
                    <p className="text-sm text-white">{line.name}</p>
                    <p className="text-xs text-purple-500">{line.description}</p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-5 p-3 bg-whatsapp-500/10 rounded-lg border border-whatsapp-500/20">
              <p className="text-xs text-whatsapp-300 font-medium mb-1">WhatsApp de apoyo</p>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-whatsapp-400 hover:text-whatsapp-300 font-bold transition-colors"
              >
                +57 300 123 4567
              </a>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Legal</h4>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-purple-300 hover:text-purple-100 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-6">
              <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">Recursos Externos</h4>
              <a
                href="https://www.minigualdadyequidad.gov.co/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-purple-300 hover:text-purple-100 transition-colors"
              >
                Ministerio de Igualdad
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-purple-800/50 mt-12 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-purple-400">
              © 2026 PurpleMatch. Todos los derechos reservados.
            </p>
            <p className="text-xs text-whatsapp-600">
              Si estas en peligro, llama al 112 o acude a tu comisaria mas cercana.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
