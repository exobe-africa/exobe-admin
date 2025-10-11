"use client";

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';
import { useToast } from '../../../context/ToastContext';
import { getApolloClient } from '../../../lib/apollo/client';
import { RESET_PASSWORD } from '../../../lib/api/auth';
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import Image from 'next/image';

function ResetPasswordClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showSuccess, showError } = useToast();
  
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [tokenValid, setTokenValid] = useState(true);

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    setToken(tokenParam);
    
    // Simulate token validation
    if (!tokenParam) {
      setTokenValid(false);
    }
  }, [searchParams]);

  const validatePassword = (password: string) => {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return {
      minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumber,
      hasSpecial,
      isValid: minLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecial,
    };
  };

  const passwordStrength = validatePassword(formData.password);
  const passwordsMatch = formData.password && formData.password === formData.confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!passwordStrength.isValid) {
      showError('Password does not meet the requirements');
      return;
    }

    if (!passwordsMatch) {
      showError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const client = getApolloClient();
      await client.mutate({
        mutation: RESET_PASSWORD,
        variables: { token, newPassword: formData.password },
      });
      setIsSuccess(true);
      showSuccess('Password reset successful!');
      setTimeout(() => router.push('/auth/login'), 1200);
    } catch (err) {
      showError('Reset link is invalid or expired. Request a new one.');
    } finally {
      setIsLoading(false);
    }
  };

  // Invalid token state
  if (!tokenValid) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
              <AlertCircle className="text-red-600" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Invalid Reset Link</h2>
            <p className="text-gray-600 mb-6">
              This password reset link is invalid or has expired.
            </p>
            <div className="space-y-3">
              <Button onClick={() => router.push('/auth/forgot-password')} fullWidth>
                Request New Reset Link
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => router.push('/auth/login')} 
                fullWidth
              >
                Back to Login
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
              <CheckCircle className="text-green-600" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Password Reset Successful!</h2>
            <p className="text-gray-600 mb-6">
              Your password has been successfully reset. You can now sign in with your new password.
            </p>
            <Button onClick={() => router.push('/auth/login')} fullWidth>
              Continue to Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Reset Your Password</h1>
          <p className="text-gray-600">
            Create a strong, secure password for your account
          </p>
        </div>

        {/* Reset Password Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <div className="relative">
                <Input
                  label="New Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter new password"
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

              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-3 space-y-2">
                  <p className="text-sm font-medium text-gray-700">Password Requirements:</p>
                  <div className="space-y-1">
                    {[
                      { label: 'At least 8 characters', valid: passwordStrength.minLength },
                      { label: 'One uppercase letter', valid: passwordStrength.hasUpperCase },
                      { label: 'One lowercase letter', valid: passwordStrength.hasLowerCase },
                      { label: 'One number', valid: passwordStrength.hasNumber },
                      { label: 'One special character', valid: passwordStrength.hasSpecial },
                    ].map((req, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                          req.valid ? 'bg-green-500' : 'bg-gray-300'
                        }`}>
                          {req.valid && <CheckCircle size={12} className="text-white" />}
                        </div>
                        <span className={req.valid ? 'text-green-700' : 'text-gray-500'}>
                          {req.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div>
              <div className="relative">
                <Input
                  label="Confirm New Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm new password"
                  value={formData.confirmPassword}
                  onChange={(value) => setFormData({ ...formData, confirmPassword: value })}
                  icon={Lock}
                  required
                  fullWidth
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              
              {formData.confirmPassword && (
                <p className={`mt-2 text-sm ${passwordsMatch ? 'text-green-600' : 'text-red-600'}`}>
                  {passwordsMatch ? '✓ Passwords match' : '✗ Passwords do not match'}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isLoading || !passwordStrength.isValid || !passwordsMatch}
              fullWidth
            >
              {isLoading ? 'Resetting Password...' : 'Reset Password'}
            </Button>

            <Link
              href="/auth/login"
              className="flex items-center justify-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Remember your password? Sign in
            </Link>
          </form>
        </div>

        {/* Security Notice */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-900">
            <strong>Security Tip:</strong> Use a unique password that you don't use for other accounts. 
            Consider using a password manager.
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

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#C8102E] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      }
    >
      <ResetPasswordClient />
    </Suspense>
  );
}

