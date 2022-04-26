import { useState, useEffect } from 'react';
import Blog from './components/Blog';
import LoginForm from './components/LoginForm';
import { getAll } from './services/blog';
import { login } from './services/login';

const App = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState({});

  useEffect(() => {
    (async () => {
      const res = await getAll();
      setBlogs(res);
    })();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const user = await login(username, password);
      setUser(user);
    } catch (err) {
      setErrorMessage('invalid credentials');
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  return (
    <div>
      <LoginForm
        setPassword={setPassword}
        setUsername={setUsername}
        handleLogin={handleLogin}
      />
      <h2>Saved Blogs</h2>
      {blogs.map(blog => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  );
};

export default App
