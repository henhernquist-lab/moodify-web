'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from 'firebase/auth';
import { auth, checkOnboardingStatus } from '../lib/auth';
import { OnboardingFlow } from '../components/onboarding/OnboardingFlow';
import SignInModal from '../components/auth/SignInModal';
import SignUpModal from '../components/auth/SignUpModal';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: () => void;
  signUp: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const onboardingComplete = await checkOnboardingStatus(user.uid);
        if (onboardingComplete) {
          setUser(user);
          setShowOnboarding(false);
        } else {
          setShowOnboarding(true);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    setUser(auth.currentUser);
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn: () => setShowSignIn(true), signUp: () => setShowSignUp(true) }}>
      {loading ? <div>Loading...</div> : children}
      {showOnboarding && <OnboardingFlow onComplete={handleOnboardingComplete} />}
      <SignInModal isOpen={showSignIn} onClose={() => setShowSignIn(false)} onSignUp={() => { setShowSignIn(false); setShowSignUp(true); }} />
      <SignUpModal isOpen={showSignUp} onClose={() => setShowSignUp(false)} onSignIn={() => { setShowSignUp(false); setShowSignIn(true); }} />
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
