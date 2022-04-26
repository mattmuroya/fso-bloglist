const NewBlogForm = ({ user, handleNewBlog, handleLogout }) => {

  return (
    <div>
      <p>Welcome, {user.name} ({user.username}).</p>
      <button
        onClick={handleLogout}
      >Logout</button>
      <h2>Add a new blog</h2>
      <form onSubmit={(e) => handleNewBlog(e)}>
        <div>
          <label htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
          />
        </div>
        <div>
          <label htmlFor="author">Author</label>
          <input
            id="author"
            type="text"
          />
        </div>
        <div>
          <label htmlFor="url">URL</label>
          <input
            id="url"
            type="text"
          />
        </div>
        <div>
          <label htmlFor="likes">Likes</label>
          <input
            id="likes"
            type="number"
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default NewBlogForm;
