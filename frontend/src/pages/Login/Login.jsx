import { useState } from 'react';
import styles from './Login.module.css';
import TextInput from '../../components/Textinput/TextInput';
import loginSchema from '../../schemas/loginSchema';
import { useFormik } from 'formik';
import { login } from '../../api/internal';
import {setUser} from '../../store/userSlice';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

const Login = () => {

  const [error, setError] = useState('');

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async ()=>{
    const data={
      username: values.username,
      password: values.password
    }
    const response = await login(data);

    if(response.status === 200){
      // setUser
      const user = {
        _id: response.data.user._id,
        email: response.data.user.email,
        username: response.data.user.username,
        auth: response.data.user.auth
      }
      dispatch(setUser(user));
      // navigate to home
      navigate('/');
    }
    else if(response.code === "ERR_BAD_REQUEST"){
      // display error message
      setError(response.response.data.errorMessage)
    }
  }
    const {values, touched, handleBlur, handleChange, errors} = useFormik({
        initialValues: {
            username: '',
            password: ''
        },

        validationSchema: loginSchema
    })
  return (
    <div className={styles.loginWrapper}>
      <div className={styles.loginHeader}>Log in to your Account</div>
      <TextInput
      name='username'
      value={values.username}
      type='text'
      onBlur={handleBlur}
      onChange={handleChange}
      placeholder='username'
      error={errors.username && touched.username ? 1 : undefined}
      errormessage={errors.username}
      />
      <TextInput
      name='password'
      value={values.password}
      type='password'
      onBlur={handleBlur}
      onChange={handleChange}
      placeholder='password'
      error={errors.password && touched.password ? 1 : undefined}
      errormessage={errors.password}
      />
      <button className={styles.loginButton} onClick={handleLogin}>Login</button>
      <span>Don't have an account? <button className={styles.createAccount} onClick={()=> navigate('/signup')}>Register</button></span>
    </div>
  )
}

export default Login
