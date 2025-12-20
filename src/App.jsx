import { useState } from 'react'
import LoginUser from './components/LoginUser'
import RegisterUser from './components/RegisterUser'
import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from './auth/ProtectedRoute';
import UrlPage from './components/UrlPage';
import HomePage from './components/HomePage';

function App() {
  const [isLoginPage, setIsLoginPage] = useState(true);
  return (
    // isLoginPage ? <LoginUser setLoginPage={setIsLoginPage} /> : <RegisterUser setLoginPage={setIsLoginPage} />
    <Routes>
      <Route path='/' element={<HomePage />} />
      <Route path='/url-page' element={
        <ProtectedRoute>
          <UrlPage />
        </ProtectedRoute>
      }/>
      <Route path='/login-user' element={<LoginUser />} />
      <Route path='/register-user' element={<RegisterUser />} />
    </Routes>
  )
}

export default App
