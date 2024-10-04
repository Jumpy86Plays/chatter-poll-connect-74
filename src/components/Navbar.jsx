import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { HomeIcon, MessageCircleIcon, BarChartIcon, LayoutDashboardIcon, SunIcon, MoonIcon, WifiIcon } from 'lucide-react';

const Navbar = () => {
  const { currentUser, logout, onlineUsers } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2 text-primary dark:text-primary-foreground font-bold text-xl hover:opacity-80 transition-opacity duration-200">
              <HomeIcon className="h-6 w-6" />
              <span className="text-shadow">Chatter Poll Connect</span>
            </Link>
            <div className="hidden md:flex space-x-4">
              <NavLink to="/" icon={<HomeIcon className="h-4 w-4" />} text="Home" />
              <NavLink to="/chat" icon={<MessageCircleIcon className="h-4 w-4" />} text="Chat" />
              <NavLink to="/poll" icon={<BarChartIcon className="h-4 w-4" />} text="Poll" />
              {currentUser && currentUser.isAdmin && (
                <NavLink to="/dashboard" icon={<LayoutDashboardIcon className="h-4 w-4" />} text="Dashboard" />
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button onClick={toggleTheme} variant="ghost" size="icon" className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
              {isDarkMode ? <SunIcon className="h-5 w-5 text-yellow-400" /> : <MoonIcon className="h-5 w-5 text-gray-600" />}
            </Button>
            {currentUser && (
              <div className="flex items-center space-x-2 glass-effect px-3 py-1 rounded-full">
                <WifiIcon className="h-4 w-4 text-green-500" />
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {onlineUsers.length} online
                </span>
              </div>
            )}
            {currentUser ? (
              <>
                <span className="text-gray-600 dark:text-gray-300">{currentUser.email}</span>
                <Button onClick={handleLogout} variant="outline" className="hover:bg-red-100 dark:hover:bg-red-900 transition-colors duration-200">Logout</Button>
              </>
            ) : (
              <Link to="/login">
                <Button variant="outline" className="hover:bg-primary hover:text-white dark:hover:bg-primary-foreground dark:hover:text-primary transition-colors duration-200">Login</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

const NavLink = ({ to, icon, text }) => (
  <Link to={to} className="flex items-center space-x-1 text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-foreground transition-colors duration-200 hover:scale-105 transform">
    {icon}
    <span>{text}</span>
  </Link>
);

export default Navbar;