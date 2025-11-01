import { useState } from 'react';
import { Search, Moon, Sun, Menu, X, User, LogOut, Shield, Settings } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { LoginForm } from './LoginForm';
import { KeyboardShortcuts } from './KeyboardShortcuts';

export const Header = () => {
  const { 
    searchTerm, 
    setSearchTerm, 
    isDarkMode, 
    toggleDarkMode,
    isSidebarOpen,
    toggleSidebar,
    auth,
    logout
  } = useAppStore();
  
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [showLogin, setShowLogin] = useState(false);

  const [showShortcuts, setShowShortcuts] = useState(false);

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            {isMobile && (
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors md:hidden"
              >
                {isSidebarOpen ? (
                  <X className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                ) : (
                  <Menu className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                )}
              </button>
            )}
            <img 
              src="/images/logo_wko_kokoro.jpg" 
              alt="WKO Katas" 
              className="h-10 w-10 rounded-full object-cover"
            />
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              WKO Katas
            </h1>
          </div>
          
          <div className="flex-1 max-w-lg mx-4 md:mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Buscar katas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm md:text-base"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            {auth.isAuthenticated ? (
              <>
                <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <User size={16} />
                  <span>{auth.currentUser?.name}</span>
                  <span className="text-xs bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 px-2 py-1 rounded">
                    {auth.currentUser?.belt}
                  </span>
                </div>
                

                <button
                  onClick={logout}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  title="Cerrar sesión"
                >
                  <LogOut size={20} className="text-gray-600 dark:text-gray-400" />
                </button>
              </>
            ) : (
              <button
                onClick={() => setShowLogin(true)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Iniciar Sesión
              </button>
            )}
            
            <button
              onClick={() => setShowShortcuts(true)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title="Atajos de teclado"
            >
              <Settings size={20} className="text-gray-600 dark:text-gray-400" />
            </button>
            
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              ) : (
                <Moon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      <LoginForm 
        isOpen={showLogin} 
        onClose={() => setShowLogin(false)} 
      />
      
      <KeyboardShortcuts 
        isOpen={showShortcuts} 
        onClose={() => setShowShortcuts(false)} 
      />
    </header>
  );
};