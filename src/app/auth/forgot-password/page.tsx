"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';
import { useToast } from '../../../context/ToastContext';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import Image from 'next/image';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { showSuccess, showError } = useToast();
  
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      if (email) {
        setIsSubmitted(true);
        showSuccess('Password reset link sent to your email');
      } else {
        showError('Please enter your email address');
      }
      setIsLoading(false);
    }, 1000);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Success State */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
              <CheckCircle className="text-green-600" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Check Your Email</h2>
            <p className="text-gray-600 mb-6">
              We've sent a password reset link to <strong>{email}</strong>
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Please check your inbox and click the link to reset your password. 
              The link will expire in 1 hour.
            </p>
            <div className="space-y-3">
              <Button onClick={() => router.push('/auth/login')} fullWidth>
                Back to Login
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => setIsSubmitted(false)} 
                fullWidth
              >
                Didn't receive the email? Resend
              </Button>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>© 2025 eXobe Platform. All rights reserved.</p>
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Forgot Password?</h1>
            <p className="text-gray-600">
              No worries! Enter your email and we'll send you reset instructions.
            </p>
          </div>

        {/* Forgot Password Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Input
                label="Email Address"
                type="email"
                placeholder="admin@exobe.co.za"
                value={email}
                onChange={setEmail}
                icon={Mail}
                required
                fullWidth
              />
              <p className="mt-2 text-sm text-gray-500">
                We'll send a password reset link to this email address.
              </p>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              fullWidth
            >
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </Button>

            <Link
              href="/auth/login"
              className="flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={16} />
              Back to Login
            </Link>
          </form>
        </div>

        {/* Security Notice */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-900">
            <strong>Security Tip:</strong> Never share your password reset link with anyone. 
            Our team will never ask for your password.
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

