import React, { useEffect, useState } from 'react';

const News = () => {
  // State to store news articles, selected category, and loading status
  const [articles, setArticles] = useState([]);
  const [category, setCategory] = useState('sports');
  const [loading, setLoading] = useState(true);

  // Available categories for the user to choose from
  const categories = ['sports', 'technology', 'business', 'health', 'science', 'entertainment'];

  // Fetch news articles when the category changes
  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://newsapi.org/v2/top-headlines?category=${category}&country=us&pageSize=10&apiKey=${process.env.REACT_APP_NEWS_API_KEY}`
        );
        const data = await response.json();
        setArticles(data.articles || []);
      } catch (error) {
        console.error('Failed to fetch news:', error);
        setArticles([]);
      }
      setLoading(false);
    };

    fetchNews();
  }, [category]);

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '20px' }}>
        🗞️ Latest {category.charAt(0).toUpperCase() + category.slice(1)} News
      </h2>

      {/* Category filter buttons */}
      <div style={{ marginBottom: '30px', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)} // Set selected category
            style={{
              padding: '8px 14px',
              borderRadius: '20px',
              border: 'none',
              backgroundColor: category === cat ? '#ff2625' : '#eee',
              color: category === cat ? '#fff' : '#333',
              cursor: 'pointer',
              fontWeight: 'bold',
              textTransform: 'capitalize',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Show loading or articles */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        articles.map((article, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '15px',
              border: '1px solid #ddd',
              marginBottom: '20px',
              padding: '15px',
              borderRadius: '10px',
              backgroundColor: '#fafafa',
            }}
          >
            {/* Show thumbnail image if available */}
            {article.urlToImage && (
              <img
                src={article.urlToImage}
                alt={article.title}
                style={{
                  width: '120px',
                  height: '80px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  flexShrink: 0,
                }}
              />
            )}

            {/* Article content */}
            <div>
              <h3 style={{ margin: '0 0 8px' }}>{article.title}</h3>
              <p style={{ margin: '0 0 10px' }}>{article.description}</p>
              <p style={{ fontSize: '12px', color: '#777' }}>
                Source: {article.source?.name} •{' '}
                {new Date(article.publishedAt).toLocaleDateString()}
              </p>
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#ff2625' }}
              >
                Read More →
              </a>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default News;
