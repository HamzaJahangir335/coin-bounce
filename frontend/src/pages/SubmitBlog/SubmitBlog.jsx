import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import styles from './SubmitBlog.module.css';
import { submitBlog } from '../../api/internal';
import TextInput from '../../components/Textinput/TextInput';
import { useNavigate } from 'react-router-dom';

const SubmitBlog = () => {

    const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [photo, setPhoto] = useState('');

  const author = useSelector(state => state.user._id);

  const getPhoto = (e)=>{
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend=()=>{
        setPhoto(reader.result);
    }
  }

  const submitHandler = async () => {
    const data={
        author, title, content, photo
    };

    const response = await submitBlog(data);

    if(response.status === 201){
        navigate('/');
    }
  }
  
    return (
    <div className={styles.wrapper}>
      <h2 className={styles.header}>Submit a Blog</h2>
      <TextInput
      type='text'
      name='title'
      value={title}
      placeholder="Title"
      onChange={(e)=> setTitle(e.target.value)}
      style={{width: '60%'}}
      />
      <textarea
      className={styles.content}
      type='text'
      name='content'
      placeholder='Your Content goes here'
      value={content}
      onChange={(e)=> setContent(e.target.value)}
      />
      <div className={styles.photoPrompt}>
        <p>Choose a Photo</p>
        <input
        type='file'
        name='photo'
        id='photo'
        accept='image/jpg image/jpeg image/png'
        onChange={getPhoto}
        />
        {photo !== "" ? <img src={photo} height={150} width={150}/> : ''}
      </div>
      <button className={styles.submit} onClick={submitHandler} disabled={title === '' || content === '' || photo === ''}>Submit</button>
    </div>
  )
}

export default SubmitBlog