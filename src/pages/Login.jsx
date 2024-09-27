import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Captcha from '../components/Captcha';

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
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-4">
            <div>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
              />
            </div>
            <div>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
              />
            </div>
            <Captcha onValidate={setIsCaptchaValid} />
            <Button type="submit" className="w-full" disabled={!isCaptchaValid}>
              Log In
            </Button>
            <Button
              type="button"
              onClick={(e) => handleSubmit(e, true)}
              className="w-full mt-2"
              disabled={!isCaptchaValid}
            >
              Sign In
            </Button>
          </form>
          {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;