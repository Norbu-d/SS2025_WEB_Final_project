// src/components/InstagramLogin.tsx
import { Lock, Mail } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';
import { Input } from './ui/input';
import { useNavigate } from 'react-router-dom';


export function InstagramLogin() {
    const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-black">
      {/* Left side with image and text */}
      <div className="hidden md:flex md:w-1/2 lg:w-2/3 flex-col items-center justify-center relative p-8">
        {/* Logo at top left */}
        <img 
          src="/src/assets/logo.webp" 
          alt="Instagram Logo"
          className="absolute top-12 left-12 h-17 w-auto"
        />
        
        {/* Text*/}
        <div className="absolute top-35 text-white text-5xl font-light mb-8 w-full text-center">
          Share what you're into with the <br />
          people <span className="text-orange-500">who</span>{' '}
          <span className="text-pink-600">get</span>{' '}
          <span className="text-fuchsia-500">you</span>.
        </div>

        {/* Main image  */}
        <div className="relative w-full h-full flex items-center justify-center mt-32">
          <img 
            src="/src/assets/login.png"
            alt="Instagram screenshot"
            className="w-full max-w-[460px] h-auto object-contain"
          />
        </div>
      </div>

{/* Right side with login form  */}
<div className="w-full md:w-1/2 lg:w-2/5 flex items-center justify-start p-4 pl-4 md:pl-4">
  <Card className="w-full max-w-[420px] border-none shadow-none bg-transparent">
    
    <CardHeader className="text-center px-0 mb-4">
      <h1 className="text-lg font-medium text-white">Log into Instagram</h1>
    </CardHeader>
    
    <CardContent className="space-y-4 px-0">
      <div className="relative w-full">
        <Input
          placeholder="Mobile number, username or email"
          className="pl-3 pr-10 bg-[#1c1c1c] text-white border border-[#2a2a2a] h-[55px] text-sm rounded-md w-full"
        />
        <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 h-6 w-4 text-gray-400" />
      </div>

      <div className="relative w-full">
        <Input
          type="password"
          placeholder="Password"
          className="pl-3 pr-10 bg-[#1c1c1c] text-white border border-[#2a2a2a] h-[55px] text-sm rounded-md w-full"
        />
        <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      </div>

      <Button className="w-full bg-[#0095f6] hover:bg-[#1877f2] text-white font-semibold h-[55px] text-sm rounded-full">
        Log in
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
        className="w-full border border-[#2a2a2a] text-white bg-transparent hover:bg-[#1f1f1f] h-[55px] text-sm rounded-full px-8"
        onClick={() => navigate('/Signup')}
      >
        Create new account
      </Button>

      <div className="flex items-center justify-center pt-2">
        <span className="text-xs text-gray-500">Meta</span>
      </div>
    </CardFooter>
  </Card>
</div>



      {/* Footer */}
      <div className="absolute bottom-4 left-0 right-0 text-center w-full text-xs text-gray-400 px-4">
        <div className="flex flex-wrap justify-center gap-x-4 mb-4">
          <a href="#" className="hover:underline">Meta</a>
          <a href="#" className="hover:underline">About</a>
          <a href="#" className="hover:underline">Blog</a>
          <a href="#" className="hover:underline">Jobs</a>
          <a href="#" className="hover:underline">Help</a>
          <a href="#" className="hover:underline">API</a>
          <a href="#" className="hover:underline">Privacy</a>
          <a href="#" className="hover:underline">Terms</a>
          <a href="#" className="hover:underline">Locations</a>
          <a href="#" className="hover:underline">Instagram Lite</a>
          <a href="#" className="hover:underline">Threads</a>
          <a href="#" className="hover:underline">Contact Uploading & Non-Users</a>
          <a href="#" className="hover:underline">Meta Verified</a>
        </div>
        <div>
          © {new Date().getFullYear()} Instagram from Meta
        </div>
      </div>
    </div>
  );
}