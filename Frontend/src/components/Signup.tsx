// src/components/InstagramSignup.tsx
import toast, { Toaster } from 'react-hot-toast';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Calendar, Lock, Mail, User } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter } from './ui/card';
import { Input } from './ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { useNavigate } from 'react-router-dom';

interface SignupData {
  email: string;
  username: string;
  password: string;
  full_name: string;
  birth_month?: number;
  birth_day?: number;
  birth_year?: number;
}

interface ErrorResponse {
  success: boolean;
  errors: Array<{ field?: string; message: string }>;
}

export function InstagramSignup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    full_name: '',
    birth_month: '',
    birth_day: '',
    birth_year: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { mutate: signup, isPending } = useMutation({
    mutationFn: async (data: SignupData) => {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include',
      });

      const responseData = await response.json();
      if (!response.ok) {
        throw responseData;
      }

      return responseData;
    },
    onSuccess: () => {
      toast.success('Account created successfully!');
      navigate('/login');
    },
    onError: (error: ErrorResponse) => {
      const newErrors: Record<string, string> = {};
      error.errors.forEach((err) => {
        const field = err.field?.toLowerCase() || 'general';
        toast.error(err.message, {
          position: 'top-center',
          style: {
            background: '#1d2c36',
            color: 'white',
            border: '1px solid #3d3d3d',
          },
        });
        if (field !== 'general') {
          newErrors[field] = err.message;
        }
      });
      setErrors(newErrors);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.username) newErrors.username = 'Username is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (!formData.full_name) newErrors.full_name = 'Full name is required';

    if (formData.birth_month || formData.birth_day || formData.birth_year) {
      if (!formData.birth_month || !formData.birth_day || !formData.birth_year) {
        newErrors.birthday = 'All birthday fields are required';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    signup({
      email: formData.email,
      username: formData.username,
      password: formData.password,
      full_name: formData.full_name,
      ...(formData.birth_month && {
        birth_month: parseInt(formData.birth_month),
        birth_day: parseInt(formData.birth_day),
        birth_year: parseInt(formData.birth_year),
      }),
    });
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  return (
  <div className="min-h-screen flex items-center justify-center bg-[#1d2c36] p-4">
    <form onSubmit={handleSubmit} className="w-full flex justify-center">

        <Card className="w-full max-w-[450px] border-none shadow-none bg-[#1d2c36]">
          <CardContent className="space-y-4 px-0">
            {/* Email */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-300">Mobile number or email</label>
              <div className="relative">
                <Input
                  placeholder="Mobile number or email"
                  className="pl-12 bg-[#1d2c36] text-white border-gray-600 h-[48px] text-base w-full"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                />
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
              {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
            </div>

            {/* Birthday */}
            <div className="space-y-2 mt-4">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-xs font-medium text-gray-300">Birthday</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[['birth_month', 12, 'Month'], ['birth_day', 31, 'Day'], ['birth_year', 100, 'Year']].map(([field, count, placeholder], i) => (
                  <Select
                    key={field}
                    value={formData[field as keyof typeof formData]}
                    onValueChange={(value) => handleChange(field as string, value)}
                  >
                    <SelectTrigger className="w-full bg-[#1d2c36] border-gray-600 text-white h-[48px] text-base">
                      <SelectValue placeholder={placeholder} />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1d2c36] border-gray-600 text-white">
                      {[...Array(Number(count))].map((_, idx) => {
                        const val = (field === 'birth_year')
                          ? `${new Date().getFullYear() - idx}`
                          : `${idx + 1}`;
                        return (
                          <SelectItem key={val} value={val} className="hover:bg-[#2a2a2a] text-base">
                            {field === 'birth_month'
                              ? new Date(0, idx).toLocaleString('default', { month: 'long' })
                              : val}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                ))}
              </div>
              {errors.birthday && <p className="text-red-500 text-xs">{errors.birthday}</p>}
            </div>

            {/* Full Name */}
            {[
              { label: 'Full name', icon: <User />, name: 'full_name', type: 'text' },
              { label: 'Username', icon: <User />, name: 'username', type: 'text' },
              { label: 'Password', icon: <Lock />, name: 'password', type: 'password' },
            ].map(({ label, icon, name, type }) => (
              <div className="space-y-2 mt-4" key={name}>
                <label className="text-xs font-medium text-gray-300">{label}</label>
                <div className="relative">
                  <Input
                    type={type}
                    placeholder={label}
                    className="pl-12 bg-[#1d2c36] text-white border-gray-600 h-[48px] text-base w-full"
                    value={formData[name]}
                    onChange={(e) => handleChange(name, e.target.value)}
                  />
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400">
                    {icon}
                  </div>
                </div>
                {errors[name] && <p className="text-red-500 text-xs">{errors[name]}</p>}
              </div>
            ))}
          </CardContent>

          <CardFooter className="flex flex-col items-center mt-6 space-y-4">
            <Button
              type="submit"
              className="w-full bg-[#0095f6] hover:bg-[#1877f2] text-white font-medium h-[48px] rounded-md text-base"
              disabled={isPending}
            >
              {isPending ? 'Creating Account...' : 'Submit'}
            </Button>
            <Button
              variant="ghost"
              className="w-full h-[48px] text-white text-base rounded-md border border-gray-600 hover:bg-[#2a2a2a]"
              onClick={() => navigate('/login')}
            >
              I already have an account
            </Button>
          </CardFooter>
        </Card>
      </form>

      <Toaster
        toastOptions={{
          duration: 4000,
          success: {
            style: {
              background: '#1d2c36',
              color: 'white',
              border: '1px solid #3d3d3d',
            },
          },
        }}
      />
    </div>
  );
}
