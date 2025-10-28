"use client";

import { useState } from 'react';
import Modal from '../../common/Modal';
import Input from '../../common/Input';
import Button from '../../common/Button';
import Checkbox from '../../common/Checkbox';
import { Lock, RefreshCw, Eye, EyeOff } from 'lucide-react';
import { generatePassword } from '../../../lib/utils/password-generator';

interface ResetPasswordModalProps {
  isOpen: boolean;
  user: {
    id: string;
    name?: string;
    email: string;
    role: string;
  } | null;
  onClose: () => void;
  onReset: (userId: string, newPassword: string, sendEmail: boolean) => Promise<void>;
}

export default function ResetPasswordModal({
  isOpen,
  user,
  onClose,
  onReset,
}: ResetPasswordModalProps) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [sendEmail, setSendEmail] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleClose = () => {
    setPassword('');
    setConfirmPassword('');
    setSendEmail(true);
    setShowPassword(false);
    setShowConfirmPassword(false);
    setError('');
    onClose();
  };

  const handleGeneratePassword = () => {
    const newPassword = generatePassword();
    setPassword(newPassword);
    setConfirmPassword(newPassword);
    setError('');
  };

  const handleSubmit = async () => {
    setError('');

    // Validation
    if (!password || !confirmPassword) {
      setError('Please enter a password');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    // Check password strength
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

    if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar) {
      setError('Password must contain uppercase, lowercase, number, and special character');
      return;
    }

    if (!user) return;

    setIsSubmitting(true);
    try {
      await onReset(user.id, password, sendEmail);
      handleClose();
    } catch (err: any) {
      setError(err.message || 'Failed to reset password');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Reset User Password">
      <div className="space-y-6">
        {/* User Info */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-2">Reset password for:</h3>
          <div className="space-y-1 text-sm">
            <p className="text-gray-700">
              <span className="font-medium">Name:</span> {user.name || 'N/A'}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Email:</span> {user.email}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Role:</span> {user.role}
            </p>
          </div>
        </div>

        {/* Generate Password Button */}
        <div>
          <Button
            onClick={handleGeneratePassword}
            icon={RefreshCw}
            variant="secondary"
            fullWidth
            type="button"
          >
            Generate Secure Password
          </Button>
          <p className="text-xs text-gray-500 mt-2">
            Click to generate a secure, memorable password automatically
          </p>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <Input
              label="New Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(value) => {
                setPassword(value);
                setError('');
              }}
              placeholder="Enter new password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="relative">
            <Input
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(value) => {
                setConfirmPassword(value);
                setError('');
              }}
              placeholder="Confirm new password"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {/* Password Requirements */}
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <p className="text-sm text-blue-900 font-medium mb-2">Password Requirements:</p>
          <ul className="text-xs text-blue-800 space-y-1">
            <li>• At least 8 characters long</li>
            <li>• Contains uppercase letter (A-Z)</li>
            <li>• Contains lowercase letter (a-z)</li>
            <li>• Contains number (0-9)</li>
            <li>• Contains special character (!@#$%&*)</li>
          </ul>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <Checkbox
            id="sendEmail"
            checked={sendEmail}
            onChange={(checked) => setSendEmail(checked)}
            label="Send new password via email"
          />
          <p className="text-xs text-gray-500 mt-1 ml-6">
            {sendEmail
              ? 'The user will receive an email with their new password'
              : 'You will need to manually provide the password to the user'}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <div className="flex gap-3 pt-4">
          <Button
            onClick={handleClose}
            variant="secondary"
            fullWidth
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            icon={Lock}
            fullWidth
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Resetting...' : 'Reset Password'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

