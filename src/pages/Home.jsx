import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { MessageCircleIcon, BarChartIcon, BookOpenIcon, HammerIcon, ShoppingCartIcon } from 'lucide-react';

const Home = () => {
  const { currentUser } = useAuth();

  return (
    <div className="container mx-auto px-4 py-12 animate-fade-in">
      <h1 className="text-5xl font-bold mb-8 text-center text-primary dark:text-primary-foreground text-shadow">
        Welcome to Warframe Hub
      </h1>
      {currentUser && (
        <p className="text-center text-xl mb-8 text-content">
          Welcome back, <span className="font-semibold text-primary dark:text-primary-foreground">{currentUser.email}</span>!
        </p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <MenuCard
          icon={<MessageCircleIcon className="mr-2" />}
          title="Chat with Others"
          description="Join our vibrant community and engage in real-time conversations with users from around the world."
          linkTo="/chat"
          linkText="Go to Chat"
        />
        <MenuCard
          icon={<BarChartIcon className="mr-2" />}
          title="Participate in Polls"
          description="Make your voice heard! Vote on exciting topics and see real-time results of community opinions."
          linkTo="/poll"
          linkText="Go to Polls"
        />
        <MenuCard
          icon={<BookOpenIcon className="mr-2" />}
          title="Warframe Wiki"
          description="Explore the vast knowledge base of Warframe lore, mechanics, and strategies."
          linkTo="https://warframe.fandom.com/wiki/WARFRAME_Wiki"
          linkText="Go to Wiki"
          external
        />
        <MenuCard
          icon={<HammerIcon className="mr-2" />}
          title="Build Guides"
          description="Discover and share optimal Warframe and weapon builds to maximize your effectiveness in missions."
          linkTo="https://overframe.gg/"
          linkText="Go to Builds"
          external
        />
        <MenuCard
          icon={<ShoppingCartIcon className="mr-2" />}
          title="Warframe Market"
          description="Trade items with other Tenno and find the best deals for your desired equipment."
          linkTo="https://warframe.market/"
          linkText="Go to Market"
          external
        />
      </div>
    </div>
  );
};

const MenuCard = ({ icon, title, description, linkTo, linkText, external = false }) => (
  <Card className="shadow-lg transform hover:scale-105 transition-all duration-300 border-gradient bg-gradient-to-br from-gradient-start via-gradient-mid to-gradient-end text-white">
    <CardHeader>
      <CardTitle className="text-2xl flex items-center">
        {icon}
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent className="p-6">
      <p className="mb-4">{description}</p>
      {external ? (
        <a href={linkTo} target="_blank" rel="noopener noreferrer">
          <Button className="w-full hover:shadow-lg transition-shadow duration-200 bg-white text-primary hover:bg-gray-100">{linkText}</Button>
        </a>
      ) : (
        <Link to={linkTo}>
          <Button className="w-full hover:shadow-lg transition-shadow duration-200 bg-white text-primary hover:bg-gray-100">{linkText}</Button>
        </Link>
      )}
    </CardContent>
  </Card>
);

export default Home;