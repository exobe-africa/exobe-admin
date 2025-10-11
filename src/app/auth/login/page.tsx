"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';
import { useAdmin } from '../../../context/AdminContext';
import { LOGIN_MUTATION } from '../../../lib/api/auth';
import { getApolloClient } from '../../../lib/apollo/client';
import { useToast } from '../../../context/ToastContext';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAdmin();
  const { showSuccess, showError } = useToast();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const client = getApolloClient();
      const { data } = await client.mutate({
        mutation: LOGIN_MUTATION,
        variables: { input: { email: formData.email, password: formData.password } },
      });
      const user = data?.login;
      if (!user) throw new Error('Invalid response');
      if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
        showError('You do not have permission to access the admin dashboard.');
        setIsLoading(false);
        return;
      }
      login({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        permissions: ['all'],
        token: user.token,
      });
      showSuccess('Welcome back! Login successful.');
      router.push('/');
    } catch (err) {
      showError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <Image 
              src="/exobe-logo.png" 
              alt="eXobe Logo" 
              width={200} 
              height={80}
              className="object-contain"
              priority
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Sign in to access the dashboard</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Input
                label="Email Address"
                type="email"
                placeholder="admin@exobe.co.za"
                value={formData.email}
                onChange={(value) => setFormData({ ...formData, email: value })}
                icon={Mail}
                required
                fullWidth
              />
            </div>

            <div>
              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(value) => setFormData({ ...formData, password: value })}
                  icon={Lock}
                  required
                  fullWidth
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-[#C8102E] border-gray-300 rounded focus:ring-[#C8102E] focus:ring-2"
                />
                <span className="ml-2 text-sm text-gray-700">Remember me</span>
              </label>

              <Link
                href="/auth/forgot-password"
                className="text-sm text-[#C8102E] hover:text-[#a00d25] font-medium"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              fullWidth
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm font-medium text-blue-900 mb-2">Demo Credentials:</p>
            <p className="text-xs text-blue-700">Email: admin@exobe.co.za</p>
            <p className="text-xs text-blue-700">Password: Any password</p>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            🔒 Your connection is secure and encrypted
          </p>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>© 2025 eXobe Platform. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}

