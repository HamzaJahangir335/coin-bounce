import React, { useEffect, useState } from 'react';
import styles from './Home.module.css';
import { getNews } from '../../api/external';
import Loader from '../../components/Loader/Loader';

const Home = () => {

  const [articles, setArticles] = useState([]);

  useEffect(() => {
    (async function getApiCalls() {
      const response = await getNews();
      setArticles(response);
    })();

    // cleanup function
    setArticles([]);
  }, [])

  const handleCardClick = (url) => {
    window.open(url, "blank")
  }

  if(articles.length === 0){
    return <Loader text="News"/>
  }

  return (
    <>
      <div className={styles.header}>Latest Articles</div>
      <div className={styles.grid}>
        {articles.map((article) => (
          <div className={styles.card} key={article.url} onClick={() => handleCardClick(article.url)}>
            <img src={article.urlToImage} alt="" />
            <h3>{article.title}</h3>
          </div>
        ))}
      </div>
    </>
  )
}

export default Home
