import { useState } from "react";
import styles from './Signup.module.css';
import TextInput from "../../components/Textinput/TextInput";
import { useFormik } from 'formik';
import { signup } from '../../api/internal';
import { setUser } from '../../store/userSlice';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import signupSchema from "../../schemas/signupSchema";

const Signup = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const  [error, setError]  = useState('');

    const handleSignup = async () => {

        const data = {
            name: values.name,
            username: values.username,
            email: values.email,
            password: values.password,
            confirmPassword: values.confirmPassword
        }

        const response = await signup(data);

        if(response.status === 201){
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
            setError(response.response.data.message)
          }
    }
    const { values, touched, handleBlur, handleChange, errors } = useFormik({
        initialValues: {
            name: '',
            username: '',
            email: '',
            password: '',
            confirmPassword: ''
        },

        validationSchema: signupSchema
    })

    return (
        <div className={styles.signupWrapper}>
            <div className={styles.signupHeader}>Create new Account</div>
            <TextInput
                name='name'
                value={values.name}
                type='text'
                placeholder='name'
                onBlur={handleBlur}
                onChange={handleChange}
                error={errors.name && touched.name ? 1 : undefined}
                errormessage={errors.name}
            />
            <TextInput
                name='username'
                type='text'
                placeholder='username'
                value={values.username}
                onBlur={handleBlur}
                onChange={handleChange}
                error={errors.username && touched.username ? 1 : undefined}
                errormessage={errors.username}
            />
            <TextInput
                name='email'
                type='text'
                placeholder='email'
                value={values.email}
                onBlur={handleBlur}
                onChange={handleChange}
                error={errors.email && touched.email ? 1 : undefined}
                errormessage={errors.email}
            />
            <TextInput
                name='password'
                type='password'
                placeholder='password'
                value={values.password}
                onBlur={handleBlur}
                onChange={handleChange}
                error={errors.password && touched.password ? 1 : undefined}
                errormessage={errors.password}
            />
            <TextInput
                name='confirmPassword'
                type='password'
                placeholder='confirmPassword'
                value={values.confirmPassword}
                onBlur={handleBlur}
                onChange={handleChange}
                error={errors.confirmPassword && touched.confirmPassword ? 1 : undefined}
                errormessage={errors.confirmPassword}
            />
            <button className={styles.signupButton} onClick={handleSignup}
            disabled={!values.name || !values.email || !values.username || !values.password || !values.confirmPassword || errors.name || errors.email || errors.username || errors.password || errors.confirmPassword}
            >Create Account</button>
            <span>Already have an account?
                <button className={styles.loginButton} onClick={() => navigate('/login')}>Login</button></span>

            {error != "" ? <p className={styles.errormessage}>{error}</p> : ''}
        </div>
    )
}

export default Signup;