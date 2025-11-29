import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Film } from 'lucide-react';

export function LoginScreen() {
  const navigate = useNavigate();

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
      setLoginError('Please enter a valid email');
      return;
    }

    if (!validatePassword(loginPassword)) {
      setLoginError('Password must be at least 6 characters');
      return;
    }

    if (loginEmail === 'admin@theater.com' && loginPassword === 'admin123') {
      navigate('/admin');
    } else {
      navigate('/movies');
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
      setRegisterError('Please enter a valid email');
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

    
    navigate('/movies');
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

        <Tabs defaultValue="login">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>

          {/* LOGIN */}
          <TabsContent value="login">
            <Card>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Password</Label>
                    <Input
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                    />
                  </div>

                  {loginError && (
                    <p className="text-red-500 text-sm">{loginError}</p>
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

          {/* REGISTER */}
          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle>Create Account</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Name</Label>
                    <Input
                      value={registerName}
                      onChange={(e) => setRegisterName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Password</Label>
                    <Input
                      type="password"
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Confirm Password</Label>
                    <Input
                      type="password"
                      value={registerConfirmPassword}
                      onChange={(e) =>
                        setRegisterConfirmPassword(e.target.value)
                      }
                    />
                  </div>

                  {registerError && (
                    <p className="text-red-500 text-sm">{registerError}</p>
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

export default LoginScreen;
