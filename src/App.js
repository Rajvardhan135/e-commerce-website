import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.scss';

import ProtectedRoute from './components/protected-route/protected-route.component';
import AdminDashboard from './routes/admin/admin-dashboard.component';
import Checkout from './routes/checkout/checkout.component';
import Home from './routes/home/home.component';
import Navigation from './routes/navigation/navigation.component';
import Shop from './routes/shop/shop.component';
import SignIn from './routes/sign-in/sign-in.component';
import SignUp from './routes/sign-up/sign-up.component';

import { setCategory } from './store/categories/category.action';
import { getAllCategories } from './utils/fakestore/fakestore.utils';
// import { getProducts } from './utils/fakestore/fakestore.utils';
import { useDispatch } from 'react-redux';
import { getProducts } from './utils/firebase/firebaseStoreServices';

import { CurrencyProvider } from './context/CurrencyContext';
import AdminUsersPage from './routes/adminUsers/AdminUsersPage';
import PaymentFail from './routes/PaymentFail/PaymentFail';
import ProfilePage from './routes/profile/profile';
import PaymentSuccess from './routes/successpage/SuccessPage';
import { setCurrentUser } from './store/user/user.action';
import { onAuthStateChangedListener } from './utils/firebase/firebase.utils';

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    let categoriesData = {}
    async function fetchData() {
      try {
        const categories = await getAllCategories();
        categories.forEach(async (category) => {
          categoriesData[category] = await getProducts(category)
        }
        )
        dispatch(setCategory(categoriesData))
      } catch (error) {
        console.log(error);
      }
    }

    fetchData();
  }, [dispatch]);

  useEffect(() => {
    const unsubscribe = onAuthStateChangedListener((user) => {
      dispatch(setCurrentUser(user));
    });

    return unsubscribe
  }, [dispatch])

  return (
    <CurrencyProvider>
      <Routes>
      <Route path='sign-in' element={<SignIn />} />
      <Route path='sign-up' element={<SignUp />} />
      <Route path='/' element={<Navigation />}>
        <Route index element={<Home />} />
        <Route path='shop/*' element={<Shop />} />
  <Route path='checkout' element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
  <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path='payment-success' element={<PaymentSuccess />} />
        <Route path='payment-fail' element={<PaymentFail />} />
        <Route path='profile' element={<ProfilePage />} />
        <Route path='adminUsers' element={<AdminUsersPage />} />
        </Route>
        </Routes>
      </CurrencyProvider>
  );
}

export default App;
