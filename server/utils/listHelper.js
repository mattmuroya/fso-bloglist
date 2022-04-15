
// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => {
  return 1;
};

const getTotalLikes = (blogs) => {
  return blogs.reduce((sum, cur) => {
    return sum + cur.likes;
  }, 0);
};

const getFavoriteBlog = (blogs) => {
  if (blogs.length < 1) return null;
  return blogs.reduce((top, cur) => {
    return cur.likes > top.likes ? cur : top;
  }, blogs[0]);
};

const getAuthorWithMostBlogs = (blogs) => {
  if (blogs.length < 1) return null;
  const accumulator = {};
  blogs.reduce((_acc, cur) => {
    if (Object.prototype.hasOwnProperty.call(accumulator, cur.author)) {
      accumulator[cur.author] += 1;
    } else {
      accumulator[cur.author] = 1;
    }
    return accumulator;
  }, accumulator);

  const author = Object.keys(accumulator).reduce((prev, cur) => {
    return accumulator[cur] > accumulator[prev]
      ? cur : prev;
  });
  
  return {
    author,
    blogs: accumulator[author]
  };
};

const getAuthorWithMostLikes = (blogs) => {
  if (blogs.length < 1) return null;
  const accumulator = {};
  blogs.reduce((_acc, cur) => {
    if (Object.prototype.hasOwnProperty.call(accumulator, cur.author)) {
      accumulator[cur.author] += cur.likes;
    } else {
      accumulator[cur.author] = cur.likes;
    }
    return accumulator;
  }, accumulator);

  const author = Object.keys(accumulator).reduce((prev, cur) => {
    return accumulator[cur] > accumulator[prev]
      ? cur : prev;
  });
  
  return {
    author,
    likes: accumulator[author]
  };
};

module.exports = {
  dummy,
  getTotalLikes,
  getFavoriteBlog,
  getAuthorWithMostBlogs,
  getAuthorWithMostLikes
};