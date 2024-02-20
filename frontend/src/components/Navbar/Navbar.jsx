import React from 'react';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'
import styles from './Navbar.module.css';
import { signout } from '../../api/internal';
import { resetUser } from '../../store/userSlice';

const Navbar = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.user.auth)
  // const isAuthenticated = true;

  const handleSignout = async () => {
    await signout();
    dispatch(resetUser());
  }

  return (
    <>
      <nav className={styles.navbar}>
        <NavLink to='/' className={`${styles.logo} ${styles.inactiveStyle}`}>CoinBounce</NavLink>
        <NavLink to='/'
          className={({ isActive }) => isActive ? styles.activeStyle : styles.inactiveStyle}
        >Home</NavLink>
        <NavLink to='/crypto'
          className={({ isActive }) => isActive ? styles.activeStyle : styles.inactiveStyle}
        >Crypto</NavLink>
        <NavLink to='/blogs'
          className={({ isActive }) => isActive ? styles.activeStyle : styles.inactiveStyle}
        >Blogs</NavLink>
        <NavLink to='/submit'
          className={({ isActive }) => isActive ? styles.activeStyle : styles.inactiveStyle}
        >Submit a Blog</NavLink>
        {isAuthenticated ?
          <div>
            <NavLink className={styles.signoutButton} onClick={handleSignout}>Sign Out</NavLink>
          </div>
          :
          <div>
            <NavLink to='/login'
              className={({ isActive }) => isActive ? styles.activeStyle : styles.inactiveStyle}
            >
              <button className={styles.loginButton}>Login</button>
            </NavLink>
            <NavLink to='/signup'
              className={({ isActive }) => isActive ? styles.activeStyle : styles.inactiveStyle}
            >
              <button className={styles.signupButton}>Sign up</button>
            </NavLink>
          </div>}
      </nav>
      <div className={styles.separator}></div>
    </>
  )
}

export default Navbar
