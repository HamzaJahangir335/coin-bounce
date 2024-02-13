import React from 'react';
import styles from './TextInput.module.css';

const TextInput = (props) => {
  return (
    <div className={styles.textWrapper}>
      <input {...props} />
      {props.error && <p className={styles.errorMessage}>{props.errormessage}</p>}
    </div>
  )
}

export default TextInput
