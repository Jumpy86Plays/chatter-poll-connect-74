import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { HomeIcon, MessageCircleIcon, BarChartIcon, LayoutDashboardIcon, SunIcon, MoonIcon } from 'lucide-react';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2 text-primary dark:text-primary-foreground font-bold text-xl">
              <HomeIcon className="h-6 w-6" />
              <span>Chatter Poll Connect</span>
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
            <Button onClick={toggleTheme} variant="ghost" size="icon">
              {isDarkMode ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
            </Button>
            {currentUser ? (
              <>
                <span className="text-gray-600 dark:text-gray-300">{currentUser.email}</span>
                <Button onClick={handleLogout} variant="outline">Logout</Button>
              </>
            ) : (
              <Link to="/login">
                <Button variant="outline">Login</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

const NavLink = ({ to, icon, text }) => (
  <Link to={to} className="flex items-center space-x-1 text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-foreground transition-colors duration-200">
    {icon}
    <span>{text}</span>
  </Link>
);

export default Navbar;