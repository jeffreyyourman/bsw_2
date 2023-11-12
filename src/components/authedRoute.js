import React from 'react';
import { useClerk } from '@clerk/clerk-react';
import { navigate } from 'gatsby';

const AuthenticatedRoute = ({ children }) => {
  const { user } = useClerk();

  // If the user is not authenticated, redirect to the login page
  if (!user) {
    navigate('/');
    return null;
  }

  // If the user is authenticated, render the children
  return <>{children}</>;
};

export default AuthenticatedRoute;