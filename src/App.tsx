import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { ComponentPage } from './pages/ComponentPage';
import { useEffect } from 'react';
import { authHelpers } from './lib/supabase';

function App() {
  useEffect(() => {
    // Listen for auth state changes (for magic link verification)
    const { data: { subscription } } = authHelpers.onAuthStateChange(async (event, session) => {
      console.log('🔐 Auth state changed:', event, session);
      
      if (event === 'SIGNED_IN' && session) {
        console.log('✅ User signed in via magic link:', session.user);
        
        // Store user session
        localStorage.setItem('currentUser', JSON.stringify({
          id: session.user.id,
          email: session.user.email,
          user_metadata: session.user.user_metadata
        }));
        
        // Clear pending user data
        localStorage.removeItem('pendingUser');
        
        // Redirect to success page
        window.location.href = '/component/overlap-wrapper';
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/component/:componentName" element={<ComponentPage />} />
      </Routes>
    </Router>
  );
}

export default App;