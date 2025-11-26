import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Film } from 'lucide-react';

interface LoginScreenProps {
  onLogin: (isAdmin: boolean) => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [loginError, setLoginError] = useState('');
  const [registerError, setRegisterError] = useState('');

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePassword = (password: string) =>
    password.length >= 6;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!validateEmail(loginEmail)) {
      setLoginError('Please enter a valid email address');
      return;
    }

    if (!validatePassword(loginPassword)) {
      setLoginError('Password must be at least 6 characters');
      return;
    }

    if (loginEmail === 'admin@theater.com' && loginPassword === 'admin123') {
      onLogin(true);
    } else {
      onLogin(false);
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError('');

    if (!registerName.trim()) {
      setRegisterError('Please enter your name');
      return;
    }

    if (!validateEmail(registerEmail)) {
      setRegisterError('Please enter a valid email address');
      return;
    }

    if (!validatePassword(registerPassword)) {
      setRegisterError('Password must be at least 6 characters');
      return;
    }

    if (registerPassword !== registerConfirmPassword) {
      setRegisterError('Passwords do not match');
      return;
    }

    onLogin(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-black p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-purple-600 p-3 rounded-full">
              <Film className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-white text-3xl mb-2">Movie Booking System</h1>
          <p className="text-gray-300">Your Premium Movie Experience</p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card>
              <CardHeader></CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="your@email.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                    />
                  </div>

                  {loginError && (
                    <div className="text-red-500 text-sm">{loginError}</div>
                  )}

                  <Button type="submit" className="w-full">
                    Login
                  </Button>

                  <p className="text-xs text-gray-500 text-center mt-4">
                    Admin login: admin@theater.com / admin123
                  </p>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle>Create Account</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-name">Full Name</Label>
                    <Input
                      id="register-name"
                      type="text"
                      placeholder="John Doe"
                      value={registerName}
                      onChange={(e) => setRegisterName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="your@email.com"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-password">Password</Label>
                    <Input
                      id="register-password"
                      type="password"
                      placeholder="••••••••"
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-confirm-password">Confirm Password</Label>
                    <Input
                      id="register-confirm-password"
                      type="password"
                      placeholder="••••••••"
                      value={registerConfirmPassword}
                      onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                      required
                    />
                  </div>

                  {registerError && (
                    <div className="text-red-500 text-sm">{registerError}</div>
                  )}

                  <Button type="submit" className="w-full">
                    Create Account
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

