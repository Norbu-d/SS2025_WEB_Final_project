// src/components/InstagramLogin.tsx
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Lock, Mail } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';
import { Input } from './ui/input';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

interface LoginData {
  email: string;
  password: string;
}

interface ErrorResponse {
  success: boolean;
  errors: Array<{ message: string }>;
}

export function InstagramLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { mutate: login, isPending } = useMutation({
    mutationFn: async (data: LoginData) => {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include',
      });

      const responseData = await response.json();

      if (!response.ok) throw responseData;
      return responseData;
    },
    onSuccess: () => {
      toast.success('Login successful!', {
        position: 'bottom-center',
        style: {
          background: '#262626',
          color: 'white',
          border: '1px solid #404040',
        },
      });
      navigate('/');
    },
    onError: (error: ErrorResponse) => {
      error.errors.forEach((err) => {
        toast.error(err.message, {
          position: 'bottom-center',
          style: {
            background: '#262626',
            color: 'white',
            border: '1px solid #404040',
          },
        });
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields', {
        position: 'bottom-center',
        style: {
          background: '#262626',
          color: 'white',
          border: '1px solid #404040',
        },
      });
      return;
    }

    login(formData);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-black">
      <Toaster toastOptions={{ duration: 2000 }} />

      {/* Left side with image and text */}
      <div className="hidden md:flex md:w-1/2 lg:w-2/3 flex-col items-center justify-center relative p-8">
        <img 
          src="/src/assets/logo.webp" 
          alt="Instagram Logo"
          className="absolute top-12 left-12 h-17 w-auto"
        />

        <div className="absolute top-35 text-white text-5xl font-light mb-8 w-full text-center">
          Share what you're into with the <br />
          people <span className="text-orange-500">who</span>{' '}
          <span className="text-pink-600">get</span>{' '}
          <span className="text-fuchsia-500">you</span>.
        </div>

        <div className="relative w-full h-full flex items-center justify-center mt-32">
          <img 
            src="/src/assets/login.png"
            alt="Instagram screenshot"
            className="w-full max-w-[460px] h-auto object-contain"
          />
        </div>
      </div>

      {/* Right side with login form */}
      <div className="w-full md:w-1/2 lg:w-2/5 flex items-center justify-start p-4 pl-4 md:pl-4">
        <form onSubmit={handleSubmit}>
          <Card className="w-full max-w-[460px] border-none shadow-none bg-transparent">
            <CardHeader className="text-center px-0 mb-4">
              <h1 className="text-lg font-medium text-white">Log into Instagram</h1>
            </CardHeader>

            <CardContent className="space-y-4 px-0">
              <div className="relative">
                <Input
                  placeholder="Mobile number, username or email"
                  className="w-[380px] pl-3 pr-10 bg-[#1c1c1c] text-white border border-[#2a2a2a] h-[55px] text-sm rounded-md"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 h-6 w-4 text-gray-400" />
              </div>

              <div className="relative">
                <Input
                  type="password"
                  placeholder="Password"
                  className="w-[380px] pl-3 pr-10 bg-[#1c1c1c] text-white border border-[#2a2a2a] h-[55px] text-sm rounded-md"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>

              <Button
                type="submit"
                className="w-[380px] bg-[#0095f6] hover:bg-[#1877f2] text-white font-semibold h-[55px] text-sm rounded-full"
                disabled={isPending}
              >
                {isPending ? 'Logging in...' : 'Log in'}
              </Button>

              <div className="text-center">
                <a href="#" className="text-xs text-white hover:underline">
                  Forgot password?
                </a>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col items-center mt-6 space-y-4">
              <Button
                variant="outline"
                className="w-[380px] border border-[#2a2a2a] text-white bg-transparent hover:bg-[#1f1f1f] h-[55px] text-sm rounded-full"
                onClick={() => navigate('/Signup')}
              >
                Create new account
              </Button>

              <div className="flex items-center justify-center pt-2">
                <span className="text-xs text-gray-500">Meta</span>
              </div>
            </CardFooter>
          </Card>
        </form>
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 left-0 right-0 text-center w-full text-xs text-gray-400 px-4">
        <div className="flex flex-wrap justify-center gap-x-4 mb-4">
          {[
            'Meta', 'About', 'Blog', 'Jobs', 'Help', 'API', 'Privacy', 'Terms',
            'Locations', 'Instagram Lite', 'Threads', 'Contact Uploading & Non-Users',
            'Meta Verified',
          ].map((item) => (
            <a key={item} href="#" className="hover:underline">{item}</a>
          ))}
        </div>
        <div>© {new Date().getFullYear()} Instagram from Meta</div>
      </div>
    </div>
  );
}
