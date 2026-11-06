import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  RefreshCw,
  Sparkles,
  UserCheck
} from 'lucide-react';
import { authService } from '../../services/authService';

interface AdminSecuritySettingsProps {
  onCredentialsChanged?: (newEmail?: string) => void;
  className?: string;
}

export const AdminSecuritySettings: React.FC<AdminSecuritySettingsProps> = ({
  onCredentialsChanged,
  className = ''
}) => {
  const [currentUserEmail, setCurrentUserEmail] = useState<string>('');
  const [loadingUser, setLoadingUser] = useState<boolean>(true);

  // Email form state
  const [newEmail, setNewEmail] = useState<string>('');
  const [confirmEmail, setConfirmEmail] = useState<string>('');
  const [emailCurrentPassword, setEmailCurrentPassword] = useState<string>('');
  const [showEmailCurrentPassword, setShowEmailCurrentPassword] = useState<boolean>(false);
  const [emailLoading, setEmailLoading] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [emailSuccess, setEmailSuccess] = useState<string | null>(null);

  // Password form state
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showCurrentPassword, setShowCurrentPassword] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [passwordLoading, setPasswordLoading] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

  useEffect(() => {
    authService.getUser().then((user) => {
      if (user?.email) {
        setCurrentUserEmail(user.email);
      }
      setLoadingUser(false);
    });
  }, []);

  // Handle Change Email
  const handleChangeEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError(null);
    setEmailSuccess(null);

    const trimmedNew = newEmail.trim().toLowerCase();
    const trimmedConfirm = confirmEmail.trim().toLowerCase();

    if (!trimmedNew) {
      setEmailError('Please enter a new email address.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedNew)) {
      setEmailError('Please provide a valid email format (e.g. name@company.com).');
      return;
    }

    if (trimmedNew === currentUserEmail.toLowerCase()) {
      setEmailError('New email cannot be identical to your current email address.');
      return;
    }

    if (trimmedNew !== trimmedConfirm) {
      setEmailError('The new email addresses do not match.');
      return;
    }

    if (!emailCurrentPassword) {
      setEmailError('Please enter your current administrator password to confirm this change.');
      return;
    }

    setEmailLoading(true);

    try {
      const result = await authService.updateEmail(trimmedNew, emailCurrentPassword);

      if (!result.success || result.error) {
        setEmailError(result.error || 'Failed to update admin email.');
        setEmailLoading(false);
        return;
      }

      setCurrentUserEmail(trimmedNew);
      setEmailSuccess(result.message || `Admin email successfully updated to ${trimmedNew}.`);
      setNewEmail('');
      setConfirmEmail('');
      setEmailCurrentPassword('');

      if (onCredentialsChanged) {
        onCredentialsChanged(trimmedNew);
      }
    } catch (err: any) {
      setEmailError(err.message || 'An unexpected error occurred.');
    } finally {
      setEmailLoading(false);
    }
  };

  // Handle Change Password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (!currentPassword) {
      setPasswordError('Please enter your current password.');
      return;
    }

    if (!newPassword) {
      setPasswordError('Please enter a new password.');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword === currentPassword) {
      setPasswordError('New password cannot be identical to your current password.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirmation password do not match.');
      return;
    }

    setPasswordLoading(true);

    try {
      const result = await authService.updatePassword(newPassword, currentPassword);

      if (!result.success || result.error) {
        setPasswordError(result.error || 'Failed to change admin password.');
        setPasswordLoading(false);
        return;
      }

      setPasswordSuccess(result.message || 'Admin password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      if (onCredentialsChanged) {
        onCredentialsChanged();
      }
    } catch (err: any) {
      setPasswordError(err.message || 'An unexpected error occurred.');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Current Admin Account Status Card */}
      <div className="bg-[#14161c] border border-neutral-800 rounded-3xl p-6 sm:p-7 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-400 to-[#FFCC00] text-black font-black flex items-center justify-center text-xl shadow-lg shadow-amber-500/20 shrink-0">
              {currentUserEmail ? currentUserEmail.charAt(0).toUpperCase() : 'A'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-white">Administrator Account</h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                  <UserCheck className="w-3 h-3" />
                  Active
                </span>
              </div>
              <div className="text-xs text-neutral-300 font-medium mt-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-neutral-400" />
                <span>{loadingUser ? 'Loading account...' : currentUserEmail || 'admin@sanjayproperties.in'}</span>
              </div>
              <p className="text-[11px] text-neutral-500 mt-1">
                You can update your login email address and security password below. Changes take effect immediately.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {/* Form 1: Change Admin Email */}
        <div className="bg-[#14161c] border border-neutral-800 rounded-3xl p-6 sm:p-7 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center gap-2.5 pb-4 border-b border-neutral-800">
              <div className="p-2 rounded-xl bg-amber-500/10 text-[#FFCC00]">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Change Admin Email</h4>
                <p className="text-[11px] text-neutral-400">Update the primary email used to access this panel</p>
              </div>
            </div>

            {/* Email Success Banner */}
            {emailSuccess && (
              <div className="mt-4 p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-start gap-2.5 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
                <span className="font-medium">{emailSuccess}</span>
              </div>
            )}

            {/* Email Error Banner */}
            {emailError && (
              <div className="mt-4 p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5 animate-fadeIn">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                <span className="font-medium">{emailError}</span>
              </div>
            )}

            <form onSubmit={handleChangeEmail} className="mt-5 space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                  Current Email
                </label>
                <input
                  type="text"
                  disabled
                  value={currentUserEmail || ''}
                  className="w-full px-4 py-2.5 bg-[#0e1014]/60 border border-neutral-800 rounded-xl text-xs text-neutral-400 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                  New Admin Email *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                    <Mail className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type="email"
                    required
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="newadmin@sanjayproperties.in"
                    className="w-full pl-9 pr-4 py-2.5 bg-[#0e1014] border border-neutral-700/80 rounded-xl text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#FFCC00] focus:ring-1 focus:ring-[#FFCC00] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                  Confirm New Email *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                    <Mail className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type="email"
                    required
                    value={confirmEmail}
                    onChange={(e) => setConfirmEmail(e.target.value)}
                    placeholder="Re-enter new admin email"
                    className="w-full pl-9 pr-4 py-2.5 bg-[#0e1014] border border-neutral-700/80 rounded-xl text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#FFCC00] focus:ring-1 focus:ring-[#FFCC00] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                  Current Password (for authorization) *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                    <Lock className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type={showEmailCurrentPassword ? 'text' : 'password'}
                    required
                    value={emailCurrentPassword}
                    onChange={(e) => setEmailCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full pl-9 pr-10 py-2.5 bg-[#0e1014] border border-neutral-700/80 rounded-xl text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#FFCC00] focus:ring-1 focus:ring-[#FFCC00] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowEmailCurrentPassword(!showEmailCurrentPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-white cursor-pointer"
                  >
                    {showEmailCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={emailLoading || !newEmail || !confirmEmail || !emailCurrentPassword}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#FFCC00] hover:bg-[#e6b800] text-black font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-[#FFCC00]/15 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {emailLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Updating Email...</span>
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4" />
                      <span>Save New Email Address</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Form 2: Change Admin Password */}
        <div className="bg-[#14161c] border border-neutral-800 rounded-3xl p-6 sm:p-7 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center gap-2.5 pb-4 border-b border-neutral-800">
              <div className="p-2 rounded-xl bg-amber-500/10 text-[#FFCC00]">
                <KeyRound className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Change Admin Password</h4>
                <p className="text-[11px] text-neutral-400">Enhance account security with a strong password</p>
              </div>
            </div>

            {/* Password Success Banner */}
            {passwordSuccess && (
              <div className="mt-4 p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-start gap-2.5 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
                <span className="font-medium">{passwordSuccess}</span>
              </div>
            )}

            {/* Password Error Banner */}
            {passwordError && (
              <div className="mt-4 p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5 animate-fadeIn">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                <span className="font-medium">{passwordError}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="mt-5 space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                  Current Password *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                    <Lock className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full pl-9 pr-10 py-2.5 bg-[#0e1014] border border-neutral-700/80 rounded-xl text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#FFCC00] focus:ring-1 focus:ring-[#FFCC00] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-white cursor-pointer"
                  >
                    {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                  New Password *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                    <KeyRound className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="w-full pl-9 pr-10 py-2.5 bg-[#0e1014] border border-neutral-700/80 rounded-xl text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#FFCC00] focus:ring-1 focus:ring-[#FFCC00] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-white cursor-pointer"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                  Confirm New Password *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                    <KeyRound className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    className="w-full pl-9 pr-10 py-2.5 bg-[#0e1014] border border-neutral-700/80 rounded-xl text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#FFCC00] focus:ring-1 focus:ring-[#FFCC00] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-white cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Password Requirements Badges */}
              <div className="flex flex-wrap gap-2 text-[10px] text-neutral-400 pt-1">
                <span
                  className={`px-2 py-0.5 rounded-md border flex items-center gap-1 ${
                    newPassword.length >= 6
                      ? 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10'
                      : 'border-neutral-800 bg-neutral-900'
                  }`}
                >
                  <CheckCircle2 className="w-3 h-3" />
                  Min 6 characters
                </span>
                <span
                  className={`px-2 py-0.5 rounded-md border flex items-center gap-1 ${
                    newPassword && newPassword === confirmPassword
                      ? 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10'
                      : 'border-neutral-800 bg-neutral-900'
                  }`}
                >
                  <CheckCircle2 className="w-3 h-3" />
                  Passwords match
                </span>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={passwordLoading || !currentPassword || !newPassword || !confirmPassword || newPassword !== confirmPassword || newPassword.length < 6}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#FFCC00] hover:bg-[#e6b800] text-black font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-[#FFCC00]/15 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {passwordLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Updating Password...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Update Admin Password</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

