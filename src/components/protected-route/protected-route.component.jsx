import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { selectCurrentUser } from '../../store/user/user.selector';

// Minimal ProtectedRoute: if currentUser exists, render children, otherwise redirect to sign-in
// Note: hooks must be called unconditionally at the top-level of the component.
const ProtectedRoute = ({ children, redirectTo = '/sign-in' }) => {
  const currentUser = useSelector(selectCurrentUser);
  const location = useLocation();

  // If user is signed in, render the protected children
  if (currentUser) return children;

  // Otherwise redirect to sign-in and preserve the attempted location
  return <Navigate to={redirectTo} replace state={{ from: location }} />;
};

export default ProtectedRoute;
