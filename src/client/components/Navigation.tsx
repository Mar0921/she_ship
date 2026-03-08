import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
import { useAuth } from '@/client/lib/auth';

const navLinks = [
  { href: '/home', label: 'Inicio', icon: Home },
  { href: '/terapeutas', label: 'Terapeutas', icon: Users },
  { href: '/comunidad', label: 'Comunidad', icon: MessageCircle },
  { href: '/recursos', label: 'Recursos', icon: BookOpen },
];

export default function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Get the correct redirect URL based on user role
  // Wait for auth to load before determining redirect
  const getDashboardUrl = () => {
    if (authLoading) return '/home'; // Show loading state, don't redirect
    // For login/signup pages, go to landing page
    if (isLoginPage || isSignupPage) return '/';
    if (user?.role === 'professional') return '/dashboard-profesional';
    if (user?.role === 'admin') return '/admin';
    if (user?.role === 'user') return '/home';
    return '/home'; // Default to home instead of landing for logged-in users
  };

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
    <header className="sticky top-0 z-50 bg-gradient-to-r from-purple-900 via-purple-800 to-purple-700 backdrop-blur-sm border-b border-purple-900/50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={getDashboardUrl()} className="flex items-center gap-2">
            <img src="/logo.png" className="w-10 h-10 object-contain" />
            <span className="text-xl font-bold text-white">PurpleMatch</span>
          </Link>

          {/* Desktop Navigation - Only show on non-login pages, non-signup pages, and non-professional pages */}
          {(!isLoginPage && !isSignupPage && !isProfessionalPage) && (
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={!user ? `/login?redirect=${link.href}` : link.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(link.href)
                      ? 'bg-white/20 text-white font-semibold'
                      : 'text-purple-100 hover:text-white hover:bg-white/10'
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
              // User home page: show Mi Perfil and Cerrar Sesion in main header
              <>
                <Link to="/perfil">
                  <Button
                    variant="ghost"
                    className={`text-purple-100 hover:text-white hover:bg-white/10 ${
                      isActive('/perfil') ? 'bg-white/20 text-white' : ''
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
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Cerrar Sesión
                </Button>
              </>
            ) : isLandingPage ? (
              // Landing page: only show Login and Register
              <>
                <Link to="/login">
                  <Button variant="ghost" className="text-purple-100 hover:text-white hover:bg-white/10">
                    Iniciar Sesión
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-whatsapp-500 hover:bg-whatsapp-600 text-white shadow-md">
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
                    className={`text-purple-100 hover:text-white hover:bg-white/10 ${
                      isActive('/perfil') ? 'bg-white/20 text-white' : ''
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
                  className={`border-white/30 text-white hover:bg-white/10 ${
                    isActive('/logout') ? 'bg-white/20' : ''
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
            className="md:hidden p-2 text-purple-100 hover:text-white rounded-lg hover:bg-white/10"
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
          <div className="fixed right-0 top-0 h-full w-80 bg-gradient-to-b from-purple-900 to-purple-800 z-50 shadow-xl md:hidden">
            <div className="p-4 border-b border-purple-700/50">
              <div className="flex items-center justify-between">
                <Link to={getDashboardUrl()} className="flex items-center gap-2">
                  <img src="/logo.png" className="w-10 h-10 object-contain" />
                  <span className="text-xl font-bold text-white">PurpleMatch</span>
                </Link>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-purple-200 hover:text-white rounded-lg hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <nav className="p-4 space-y-2">
              {isLoginPage || isSignupPage || isProfessionalPage ? (
                // Login/Signup/Professional page: show nothing
                <div className="py-8 text-center text-purple-300">
                  <span className="text-sm">Inicia sesión para continuar</span>
                </div>
              ) : isLandingPage ? (
                // Landing page mobile: only show Login and Register
                <div className="space-y-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-purple-100 hover:bg-white/10 hover:text-white"
                  >
                    <User className="w-5 h-5" />
                    <span className="font-medium">Iniciar Sesión</span>
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors bg-whatsapp-500 text-white hover:bg-whatsapp-600"
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
                        to={!user ? `/login?redirect=${link.href}` : link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                          isActive(link.href)
                            ? 'bg-white/20 text-white'
                            : 'text-purple-100 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{link.label}</span>
                      </Link>
                    );
                  })}

                  {!isUserHomePage && (
                    <div className="pt-4 border-t border-purple-700/50 mt-4">
                      <Link
                        to="/perfil"
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                          isActive('/perfil')
                            ? 'bg-white/20 text-white'
                            : 'text-purple-100 hover:bg-white/10 hover:text-white'
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
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors w-full text-left ${
                          isActive('/logout')
                            ? 'bg-white/20 text-white'
                            : 'text-purple-100 hover:bg-white/10 hover:text-white'
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
