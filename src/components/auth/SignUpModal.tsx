'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { signUpWithEmail, signInWithGoogle } from '../../lib/auth';

const schema = z.object({
  displayName: z.string().min(2, 'Display name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const SignUpModal = ({ isOpen, onClose, onSignIn }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });
  const [firebaseError, setFirebaseError] = useState('');

  const onSubmit = async (data) => {
    try {
      await signUpWithEmail(data.email, data.password, data.displayName);
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-[#11131A] p-8 rounded-lg shadow-xl w-[480px]">
        <h2 className="text-3xl font-bold text-center mb-6 font-playfair-display">Moodify</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <input {...register('displayName')} className="w-full p-3 bg-[#171A22] rounded border border-[#2A2D3E] text-white" placeholder="Display Name" />
            {errors.displayName && <p className="text-[#FF6B6B] text-sm mt-1">{errors.displayName.message}</p>}
          </div>
          <div className="mb-4">
            <input {...register('email')} className="w-full p-3 bg-[#171A22] rounded border border-[#2A2D3E] text-white" placeholder="Email" />
            {errors.email && <p className="text-[#FF6B6B] text-sm mt-1">{errors.email.message}</p>}
          </div>
          <div className="mb-4">
            <input type="password" {...register('password')} className="w-full p-3 bg-[#171A22] rounded border border-[#2A2D3E] text-white" placeholder="Password" />
            {errors.password && <p className="text-[#FF6B6B] text-sm mt-1">{errors.password.message}</p>}
          </div>
          {firebaseError && <p className="text-[#FF6B6B] text-sm mb-4">{firebaseError}</p>}
          <button type="submit" className="w-full p-3 bg-[#7C5CFF] rounded text-white font-bold mb-4">Create Account</button>
        </form>
        <button onClick={handleGoogleSignIn} className="w-full p-3 border border-white rounded text-white font-bold mb-4 flex items-center justify-center">
          <img src="/google.svg" alt="Google" className="w-6 h-6 mr-2" />
          Or continue with Google
        </button>
        <p className="text-center text-gray-400">Already have an account? <button onClick={onSignIn} className="text-white font-bold">Sign in</button></p>
      </div>
    </div>
  );
};

export default SignUpModal;
