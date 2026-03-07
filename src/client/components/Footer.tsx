import { Link } from 'react-router-dom';
import { Heart, Phone, Shield, ExternalLink } from 'lucide-react';

const emergencyLines = [
  {
    number: '016',
    name: 'Violencia de genero',
    description: '24h, gratuita',
    highlight: true
  },
  {
    number: '112',
    name: 'Emergencias',
    description: 'Linea general'
  },
  {
    number: '717 003 717',
    name: 'Telefono de la Esperanza',
    description: 'Ayuda emocional'
  }
];

const platformLinks = [
  { href: '/terapeutas', label: 'Encontrar Terapeuta' },
  { href: '/comunidad', label: 'Comunidad' },
  { href: '/recursos', label: 'Recursos' },
  { href: '/perfil', label: 'Mi Espacio' }
];

const legalLinks = [
  { href: '/terms', label: 'Terminos de uso' },
  { href: '/privacy', label: 'Politica de privacidad' },
  { href: '/cookies', label: 'Politica de cookies' }
];

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400">
      {/* Emergency Banner */}
      <div className="bg-red-900/20 border-b border-red-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center animate-pulse">
                <Phone className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white font-semibold">Linea 016 - Violencia de genero</p>
                <p className="text-red-300 text-sm">Disponible 24h, gratuita y confidencial</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              {emergencyLines.slice(1).map((line) => (
                <div key={line.number} className="text-center">
                  <p className="text-white font-bold">{line.number}</p>
                  <p className="text-xs text-gray-400">{line.name}</p>
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
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">PurpleMatch</span>
            </div>
            <p className="text-sm mb-6">
              Plataforma de acompañamiento emocional y psicologico diseñada exclusivamente para mujeres. Un espacio seguro y confidencial.
            </p>
            <div className="flex items-center gap-2 px-3 py-2 bg-purple-900/30 rounded-lg border border-purple-800/30">
              <Shield className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-purple-300">Datos Protegidos</span>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Plataforma</h4>
            <ul className="space-y-3">
              {platformLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help Lines */}
          <div>
            <h4 className="text-white font-semibold mb-4">Lineas de Ayuda</h4>
            <ul className="space-y-3">
              {emergencyLines.map((line) => (
                <li key={line.number} className="flex items-start gap-2">
                  <span className={`font-bold ${line.highlight ? 'text-red-400' : 'text-purple-400'}`}>
                    {line.number}
                  </span>
                  <div>
                    <p className="text-sm text-white">{line.name}</p>
                    <p className="text-xs text-gray-500">{line.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-6">
              <h4 className="text-white font-semibold mb-3">Recursos Externos</h4>
              <a
                href="https://www.migualdad.gob.es"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm hover:text-white transition-colors"
              >
                Ministerio de Igualdad
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm">
              © 2026 PurpleMatch. Todos los derechos reservados.
            </p>
            <p className="text-xs text-gray-500">
              Si estas en peligro, llama al 112 o acude a tu comisaria mas cercana.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
