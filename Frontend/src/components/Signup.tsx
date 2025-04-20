// src/components/InstagramSignup.tsx
import { Calendar, Lock, Mail, User } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';
import { Input } from './ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { useNavigate } from 'react-router-dom';

export function InstagramSignup() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#1d2c36] p-4">
      <Card className="w-full max-w-[480px] border-none shadow-none bg-[#1d2c36]">
        <CardHeader className="text-center px-0">
          <h1 className="text-2xl font-semibold mb-2 text-white">
            Get started on Instagram
          </h1>
          <p className="text-gray-300 text-sm mb-6">
            Sign up to see photos and videos from your friends.
          </p>
        </CardHeader>

        <CardContent className="space-y-4 px-0">
          {/* Mobile/Email */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-300">
              Mobile number or email
            </label>
            <div className="relative">
              <Input
                placeholder="Mobile number or email"
                className="pl-12 bg-[#1d2c36] text-white border-gray-600 h-[48px] text-base"
              />
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" /> 
            </div>
          </div>

          <p className="text-xs text-gray-400 leading-relaxed">
            You may receive notifications from us.{' '}
            <a href="#" className="text-blue-400">
              Learn why we ask for your contact information.
            </a>
          </p>

          {/* Birthday */}
          <div className="space-y-2 mt-4">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-gray-400 mr-2" /> 
              <span className="text-xs font-medium text-gray-300">Birthday </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {/* Month */}
              <Select>
                <SelectTrigger className="w-full bg-[#1d2c36] border-gray-600 text-white h-[48px] text-base"> 
                  <SelectValue placeholder="Month" />
                </SelectTrigger>
                <SelectContent className="bg-[#1d2c36] border-gray-600 text-white">
                  {[
                    'January',
                    'February',
                    'March',
                    'April',
                    'May',
                    'June',
                    'July',
                    'August',
                    'September',
                    'October',
                    'November',
                    'December',
                  ].map((month) => (
                    <SelectItem
                      key={month}
                      value={month}
                      className="hover:bg-[#2a2a2a] text-base" 
                    >
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Day */}
              <Select>
                <SelectTrigger className="w-full bg-[#1d2c36] border-gray-600 text-white h-[48px] text-base"> 
                  <SelectValue placeholder="Day" />
                </SelectTrigger>
                <SelectContent className="bg-[#1d2c36] border-gray-600 text-white">
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                    <SelectItem
                      key={day}
                      value={day.toString()}
                      className="hover:bg-[#2a2a2a] text-base"
                    >
                      {day}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Year */}
              <Select>
                <SelectTrigger className="w-full bg-[#1d2c36] border-gray-600 text-white h-[48px] text-base"> 
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent className="bg-[#1d2c36] border-gray-600 text-white max-h-[200px] overflow-y-auto">
                  {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                    <SelectItem
                      key={year}
                      value={year.toString()}
                      className="hover:bg-[#2a2a2a] text-base" 
                    >
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Full Name */}
          <div className="space-y-2 mt-4">
            <label className="text-xs font-medium text-gray-300">Full name</label>
            <div className="relative">
              <Input
                placeholder="Full name"
                className="pl-12 bg-[#1d2c36] text-white border-gray-600 h-[48px] text-base" 
              />
              <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" /> 
            </div>
          </div>

          {/* Username */}
          <div className="space-y-2 mt-4">
            <label className="text-xs font-medium text-gray-300">Username</label>
            <div className="relative">
              <Input
                placeholder="Username"
                className="pl-12 bg-[#1d2c36] text-white border-gray-600 h-[48px] text-base" 
              />
              <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2 mt-4">
            <label className="text-xs font-medium text-gray-300">Password</label>
            <div className="relative">
              <Input
                type="password"
                placeholder="Password"
                className="pl-12 bg-[#1d2c36] text-white border-gray-600 h-[48px] text-base"
              />
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" /> 
            </div>
          </div>

          {/* Legal Info */}
          <div className="space-y-4 mt-6">
            <p className="text-xs text-gray-400">
              People who use our service may have uploaded your contact information
              to Instagram.{' '}
              <a href="#" className="text-blue-400">
                Learn more
              </a>
              .
            </p>
            <p className="text-xs text-gray-400">
              By tapping Submit, you agree to create an account and to Instagram's{' '}
              <a href="#" className="text-blue-400">
                Terms
              </a>
              ,{' '}
              <a href="#" className="text-blue-400">
                Privacy Policy
              </a>
              , and{' '}
              <a href="#" className="text-blue-400">
                Cookies Policy
              </a>
              .
            </p>
            <p className="text-xs text-gray-400">
              The Privacy Policy describes the ways we can use the information we
              collect when you create an account.
            </p>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col items-center mt-6 space-y-4">
          <Button className="w-full bg-[#0095f6] hover:bg-[#1877f2] text-white font-medium h-[48px] rounded-md text-base"> 
            Submit
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

      {/* Footer */}
      <div className="w-full text-center text-xs text-gray-400 px-4 mt-10 mb-6">
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mb-4">
          {[
            'Meta',
            'About',
            'Blog',
            'Jobs',
            'Help',
            'API',
            'Privacy',
            'Terms',
            'Locations',
            'Instagram Lite',
            'Contact Uploading & Non-Users',
            'Meta Verified',
          ].map((item) => (
            <a key={item} href="#" className="hover:underline text-gray-400">
              {item}
            </a>
          ))}
        </div>
        <div className="flex justify-center items-center space-x-2 text-gray-400">
          <span>English</span>
          <span>© {new Date().getFullYear()} Instagram from Meta</span>
        </div>
      </div>
    </div>
  );
}