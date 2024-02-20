import React, { useEffect, useState } from 'react';
import styles from './BlogDetails.module.css';
import { getBlogById, getCommentsById, deleteBlog, postComment } from '../../api/internal';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import Loader from '../../components/Loader/Loader';
import CommentList from '../../components/CommentList/CommentList';

const BlogDetails = () => {
    const [blog, setBlog] = useState([]);
    const [comments, setComments] = useState([]);
    const [ownsBlog, setOwnsBlog] = useState(false);
    const [newComment, setNewComment] = useState("");
    const [reload, setReload] = useState(false);

    const navigate = useNavigate();

    const params = useParams();
    const blogId = params.id;

    const username = useSelector(state => state.user.username);
    const userId = useSelector(state => state.user._id);

    useEffect(() => {
        async function getBlogDetials() {
            const commentResponse = await getCommentsById(blogId);

            if (commentResponse.status === 200) {
                setComments(commentResponse.data.data)
            }

            const blogResponse = await getBlogById(blogId)

            if (blogResponse.status === 200) {

                // set ownership
                setOwnsBlog(username === blogResponse.data.blog.authorUsername)
                setBlog(blogResponse.data.blog)
            }
        }
        getBlogDetials();
    }, [reload])

    const postCommentHandler = async () => {
        const data = {
            content: newComment,
            author: userId,
            blog: blogId
        };

        const response = await postComment(data);

        if (response.status === 201) {
            setNewComment("");
            setReload(!reload);
        }
    }

    const deleteBlogHandler = async () => {
        const response = await deleteBlog(blogId);

        if (response.status === 200) {
            navigate('/');
        }
    }

    if (blog.length === 0) {
        return <Loader text="Blog Details" />
    }
    return (
        <div className={styles.detailsWrapper}>
            <div className={styles.left}>
                <h1 className={styles.title}>{blog.title}</h1>
                <div className={styles.meta}>
                    <p>@{blog.authorUsername + " on " + new Date(blog.createdAt).toDateString()}</p>
                </div>
                <div className={styles.photo}>
                    <img src={blog.photo} height={250} width={250} />
                </div>
                <p className={styles.content}>{blog.content}</p>
                {
                    ownsBlog && (
                        <div className={styles.controls}>
                            <button className={styles.edit} onClick={() => { navigate(`/blog-update/${blog._id}`) }}>Edit</button>
                            <button className={styles.delete} onClick={deleteBlogHandler}>Delete</button>
                        </div>
                    )
                }
            </div>
            <div className={styles.right}>
                <div className={styles.commentWrapper}>
                    <CommentList comments={comments} />
                    <div className={styles.postComment}>
                        <input type="text" className={styles.input}
                            placeholder='You can comment here'
                            value={newComment}
                            onChange={e => setNewComment(e.target.value)}
                        />
                        <button className={styles.postCommentButton} onClick={postCommentHandler}>Post</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BlogDetails
