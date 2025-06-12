import React from 'react'
import RegisterForm from '../../../Api/Auth/Register/Register'
import LoginForm from '../../../Api/Auth/Login/Login'
import  Navbar  from '../../components/navbar/Navbar'
import { useSelector } from 'react-redux'
 const LoginAndSignUp = () => {
  const showRegister = useSelector((state) => state.client.showRegister);
  return (
    <div>
      <Navbar/>
      {
        showRegister ? <RegisterForm/>  : <LoginForm/>
      }
    
    </div>
  )
}

export default LoginAndSignUp







