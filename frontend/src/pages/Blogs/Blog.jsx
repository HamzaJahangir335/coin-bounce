import { useEffect, useState } from 'react';
import styles from './Blog.module.css';
import { getAllBlogs } from '../../api/internal';
import Loader from '../../components/Loader/Loader';
import { useNavigate } from 'react-router-dom';

const Blog = () => {

    const [blogs, setBlogs] = useState([]);
     console.log(blogs)
    const navigate = useNavigate();

    useEffect(() => {
        (async function getAllBlogsApiCall(){
            const response = await getAllBlogs();

            if(response.status === 200){
                setBlogs(response.data.blogs);
            }
        }
        )();
    },[])


    if(blogs.length === 0){
        return <Loader text="Blogs" />
    }

    return(
        <div className={styles.blogsWrapper}>
            {blogs.map((blog)=>(
                <div key={blog._id} className={styles.blog} onClick={()=> navigate(`/blog/${blog._id}`)}>
                    <h2>{blog.title}</h2>
                    <img src={blog.photo} alt='the image'/>
                    <p>{blog.content}</p>
                </div>
            ))}
        </div>
    );
}

export default Blog;