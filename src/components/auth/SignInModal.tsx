'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { signInWithEmail, signInWithGoogle, resetPassword } from '../../lib/auth';

const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

const SignInModal = ({ isOpen, onClose, onSignUp }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });
  const [firebaseError, setFirebaseError] = useState('');
  const [resetSent, setResetSent] = useState(false);

  const onSubmit = async (data) => {
    try {
      await signInWithEmail(data.email, data.password);
      onClose();
    } catch (error) {
      setFirebaseError(error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      onClose();
    } catch (error) {
      setFirebaseError(error.message);
    }
  }

  const handlePasswordReset = async () => {
    const email = prompt('Please enter your email to reset your password:');
    if (email) {
      try {
        await resetPassword(email);
        setResetSent(true);
      } catch (error) {
        setFirebaseError(error.message);
      }
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-[#11131A] p-8 rounded-lg shadow-xl w-[480px]">
        <h2 className="text-3xl font-bold text-center mb-6 font-playfair-display">Moodify</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <input {...register('email')} className="w-full p-3 bg-[#171A22] rounded border border-[#2A2D3E] text-white" placeholder="Email" />
            {errors.email && <p className="text-[#FF6B6B] text-sm mt-1">{errors.email.message}</p>}
          </div>
          <div className="mb-4">
            <input type="password" {...register('password')} className="w-full p-3 bg-[#171A22] rounded border border-[#2A2D3E] text-white" placeholder="Password" />
            {errors.password && <p className="text-[#FF6B6B] text-sm mt-1">{errors.password.message}</p>}
          </div>
          {firebaseError && <p className="text-[#FF6B6B] text-sm mb-4">{firebaseError}</p>}
          {resetSent && <p className="text-green-500 text-sm mb-4">Check your inbox for a password reset link.</p>}
          <button type-="submit" className="w-full p-3 bg-[#7C5CFF] rounded text-white font-bold mb-4">Sign In</button>
        </form>
        <button onClick={handleGoogleSignIn} className="w-full p-3 border border-white rounded text-white font-bold mb-4 flex items-center justify-center">
          <img src="/google.svg" alt="Google" className="w-6 h-6 mr-2" />
          Or continue with Google
        </button>
        <div className="flex justify-between items-center text-sm text-gray-400">
          <button onClick={handlePasswordReset} className="hover:text-white">Forgot password?</button>
          <p>Don't have an account? <button onClick={onSignUp} className="text-white font-bold">Sign up</button></p>
        </div>
      </div>
    </div>
  );
};

export default SignInModal;
