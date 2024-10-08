import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { HomeIcon, MessageCircleIcon, BarChartIcon, LayoutDashboardIcon, SunIcon, MoonIcon, WifiIcon, LogOutIcon, BookOpenIcon, HammerIcon, ShoppingCartIcon } from 'lucide-react';

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
    <nav className="bg-cyberpunk-dark text-cyberpunk-blue shadow-md transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center py-4">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <Link to="/" className="flex items-center space-x-2 font-bold text-xl hover:text-cyberpunk-pink transition-colors duration-200">
              <HomeIcon className="h-6 w-6" />
              <span className="font-cyberpunk animate-neon-glow">Warframe Hub</span>
            </Link>
          </div>
          <div className="flex flex-wrap justify-center md:justify-start items-center gap-4">
            <NavLink to="/" icon={<HomeIcon className="h-4 w-4" />} text="Home" />
            <NavLink to="/chat" icon={<MessageCircleIcon className="h-4 w-4" />} text="Chat" />
            <NavLink to="/poll" icon={<BarChartIcon className="h-4 w-4" />} text="Poll" />
            <ExternalNavLink href="https://warframe.fandom.com/wiki/WARFRAME_Wiki" icon={<BookOpenIcon className="h-4 w-4" />} text="Wiki" />
            <ExternalNavLink href="https://overframe.gg/" icon={<HammerIcon className="h-4 w-4" />} text="Build Guides" />
            <ExternalNavLink href="https://warframe.market/" icon={<ShoppingCartIcon className="h-4 w-4" />} text="Market" />
            {currentUser && currentUser.isAdmin && (
              <NavLink to="/dashboard" icon={<LayoutDashboardIcon className="h-4 w-4" />} text="Dashboard" />
            )}
          </div>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <Button onClick={toggleTheme} variant="ghost" size="icon" className="hover:bg-cyberpunk-light hover:text-cyberpunk-yellow transition-colors duration-200">
              {isDarkMode ? <SunIcon className="h-5 w-5 text-cyberpunk-yellow" /> : <MoonIcon className="h-5 w-5 text-cyberpunk-blue" />}
            </Button>
            {currentUser && (
              <div className="flex items-center space-x-2 bg-cyberpunk-light bg-opacity-20 px-3 py-1 rounded-full">
                <WifiIcon className="h-4 w-4 text-cyberpunk-green" />
                <span className="text-sm">
                  {onlineUsers.length} online
                </span>
              </div>
            )}
            {currentUser ? (
              <>
                <span className="text-cyberpunk-pink">{currentUser.email}</span>
                <Button onClick={handleLogout} variant="outline" className="bg-cyberpunk-light bg-opacity-20 hover:bg-opacity-30 transition-colors duration-200 text-cyberpunk-yellow">
                  <LogOutIcon className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <Link to="/login">
                <Button variant="outline" className="bg-cyberpunk-light bg-opacity-20 hover:bg-opacity-30 transition-colors duration-200 text-cyberpunk-yellow">Login</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

const NavLink = ({ to, icon, text }) => (
  <Link to={to} className="flex items-center space-x-1 hover:text-cyberpunk-pink transition-colors duration-200 hover:scale-105 transform">
    {icon}
    <span className="font-cyberpunk">{text}</span>
  </Link>
);

const ExternalNavLink = ({ href, icon, text }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-1 hover:text-cyberpunk-pink transition-colors duration-200 hover:scale-105 transform">
    {icon}
    <span className="font-cyberpunk">{text}</span>
  </a>
);

export default Navbar;