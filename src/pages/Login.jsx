import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import Captcha from '../components/Captcha';
import { LogInIcon, UserPlusIcon } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isCaptchaValid, setIsCaptchaValid] = useState(false);
  const { login, signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e, isSignIn = false) => {
    e.preventDefault();
    setError('');

    if (!isCaptchaValid) {
      setError('Please enter the correct captcha');
      return;
    }

    try {
      if (isSignIn) {
        await signIn(email, password);
      } else {
        await login(email, password);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to log in. Please check your credentials.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
            <Captcha onValidate={setIsCaptchaValid} />
            <Button type="submit" className="w-full" disabled={!isCaptchaValid}>
              <LogInIcon className="h-4 w-4 mr-2" />
              Log In
            </Button>
          </form>
          <Button
            onClick={(e) => handleSubmit(e, true)}
            className="w-full"
            variant="outline"
            disabled={!isCaptchaValid}
          >
            <UserPlusIcon className="h-4 w-4 mr-2" />
            Sign Up
          </Button>
          {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;