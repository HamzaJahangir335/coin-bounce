import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Navbar.module.css';

const Navbar = () => {
  const isAuthenticated = false;
  return (
    <>
      <nav className={styles.navbar}>
        <NavLink to='/' className={`${styles.logo} ${styles.inactiveStyle}`}>CoinBounce</NavLink>
        <NavLink to='/'
        className={({isActive})=> isActive ? styles.activeStyle : styles.inactiveStyle}
        >Home</NavLink>
        <NavLink to='/crypto'
        className={({isActive})=> isActive ? styles.activeStyle : styles.inactiveStyle}
        >Crypto</NavLink>
        <NavLink to='/blogs'
        className={({isActive})=> isActive ? styles.activeStyle : styles.inactiveStyle}
        >Blogs</NavLink>
        <NavLink to='/submit'
        className={({isActive})=> isActive ? styles.activeStyle : styles.inactiveStyle}
        >Submit a Blog</NavLink>
        {isAuthenticated ? <div><NavLink className={styles.signoutButton}>Sign Out</NavLink></div> :
        <div><NavLink to='/login'
        className={({isActive})=> isActive ? styles.activeStyle : styles.inactiveStyle}
        >
          <button className={styles.loginButton}>Login</button>
        </NavLink>
        <NavLink to='/signup'
        className={({isActive})=> isActive ? styles.activeStyle : styles.inactiveStyle}
        >
          <button className={styles.signupButton}>Sign up</button>
        </NavLink></div>}
      </nav>
      <div className={styles.separator}></div>
    </>
  )
}

export default Navbar
