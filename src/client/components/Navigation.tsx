import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Heart,
  Menu,
  X,
  Home,
  Users,
  MessageCircle,
  BookOpen,
  User,
  LayoutDashboard,
  Settings,
  LogOut
} from 'lucide-react';
import { Button } from '@/client/components/ui/Button';

const navLinks = [
  { href: '/home', label: 'Inicio', icon: Home },
  { href: '/terapeutas', label: 'Terapeutas', icon: Users },
  { href: '/comunidad', label: 'Comunidad', icon: MessageCircle },
  { href: '/recursos', label: 'Recursos', icon: BookOpen },
];

export default function Navigation() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  // Check if we're on the landing page, user home page, login page, signup pages or professional pages
  const isLandingPage = location.pathname === '/' || location.pathname === '/landing';
  const isUserHomePage = location.pathname === '/home';
  const isLoginPage = location.pathname === '/login';
  const isSignupPage = location.pathname === '/signup' || location.pathname.startsWith('/signup/');
  const isProfessionalPage = location.pathname === '/dashboard-profesional';

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">PurpleMatch</span>
          </Link>

          {/* Desktop Navigation - Only show on non-landing pages, non-login pages, non-signup pages, and non-professional pages */}
          {(!isLandingPage && !isLoginPage && !isSignupPage && !isProfessionalPage) && (
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(link.href)
                      ? 'bg-purple-100 text-purple-700'
                      : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          )}

          {/* Desktop User Buttons - Different based on page */}
          <div className="hidden md:flex items-center gap-3">
            {isLoginPage || isSignupPage || isProfessionalPage ? (
              // Login/Signup/Professional page: show nothing
              null
            ) : isUserHomePage ? (
              // User home page: show nothing (navigation links are enough)
              null
            ) : isLandingPage ? (
              // Landing page: only show Login and Register
              <>
                <Link to="/login">
                  <Button variant="ghost" className="text-gray-700">
                    Iniciar Sesión
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                    Registrarse
                  </Button>
                </Link>
              </>
            ) : (
              // Other pages: show Mi Perfil and Cerrar Sesion
              <>
                <Link to="/perfil">
                  <Button
                    variant="ghost"
                    className={`text-gray-700 ${
                      isActive('/perfil') ? 'bg-purple-100 text-purple-700' : ''
                    }`}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Mi Perfil
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  onClick={() => {
                    localStorage.removeItem('token');
                    window.location.href = '/';
                  }}
                  className={`border-purple-200 text-purple-600 ${
                    isActive('/logout') ? 'bg-purple-100' : ''
                  }`}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Cerrar Sesión
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Sheet */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Sheet */}
          <div className="fixed right-0 top-0 h-full w-80 bg-white z-50 shadow-xl md:hidden">
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                    <Heart className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold text-gray-900">PurpleMatch</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <nav className="p-4 space-y-2">
              {isLoginPage || isSignupPage || isProfessionalPage ? (
                // Login/Signup/Professional page: show nothing
                <div className="py-8 text-center text-gray-500">
                  <span className="text-sm">Inicia sesión para continuar</span>
                </div>
              ) : isLandingPage ? (
                // Landing page mobile: only show Login and Register
                <div className="space-y-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-gray-700 hover:bg-gray-50"
                  >
                    <User className="w-5 h-5" />
                    <span className="font-medium">Iniciar Sesión</span>
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors bg-purple-600 text-white hover:bg-purple-700"
                  >
                    <Heart className="w-5 h-5" />
                    <span className="font-medium">Registrarse</span>
                  </Link>
                </div>
              ) : (
                // Other pages mobile: show full navigation
                <>
                  {navLinks.map((link) => {
                    const Icon = link.icon;
                    return (
                      <Link
                        key={link.href}
                        to={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                          isActive(link.href)
                            ? 'bg-purple-100 text-purple-700'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{link.label}</span>
                      </Link>
                    );
                  })}

                  {!isUserHomePage && (
                    <div className="pt-4 border-t border-gray-100 mt-4">
                      <Link
                        to="/perfil"
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                          isActive('/perfil')
                            ? 'bg-purple-100 text-purple-700'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <Settings className="w-5 h-5" />
                        <span className="font-medium">Mi Perfil</span>
                      </Link>
                      <button
                        onClick={() => {
                          localStorage.removeItem('token');
                          window.location.href = '/';
                        }}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                          isActive('/logout')
                            ? 'bg-purple-100 text-purple-700'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Cerrar Sesión</span>
                      </button>
                    </div>
                  )}
                </>
              )}
            </nav>
          </div>
        </>
      )}
    </header>
  );
}
