import { useState, useEffect } from 'react';
import Blog from './components/Blog';
import { getAll } from './services/blog';

const App = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await getAll();
      setBlogs(res);
    })();
  }, []);

  return (
    <div>
      <h2>Saved Blogs</h2>
      {blogs.map(blog => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  )
};

export default App
