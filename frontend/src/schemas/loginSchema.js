import * as yup from 'yup';

const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
const ErrorMessage = 'use uppercase, lower case and digits';

const loginSchema = yup.object().shape({
    username: yup.string().min(5).max(30).required('Username is required'),
    password: yup.string().min(8).max(25).matches(passwordPattern, {message: ErrorMessage}).required()
});

export default loginSchema;