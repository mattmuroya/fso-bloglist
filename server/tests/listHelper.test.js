const listHelper = require('../utils/listHelper');

test('dummy function return value of 1', () => {
  const blogs = [];
  expect(listHelper.dummy(blogs)).toBe(1);
});

const listWithNoBlog = [];

const listWithOneBlog = [{
  _id: '5a422aa71b54a676234d17f8',
  title: 'Go To Statement Considered Harmful',
  author: 'Edsger W. Dijkstra',
  url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
  likes: 5,
  __v: 0
}];

const listWithThreeBlogs = [{
  _id: '5a422aa71b54a676234d17f8',
  title: 'Go To Statement Considered Harmful',
  author: 'Edsger W. Dijkstra',
  url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
  likes: 5,
  __v: 0
},
{
  _id: '2',
  title: 'blog 2',
  author: 'wolverine',
  url: 'google.com',
  likes: 0,
  __v: 0
},
{
  _id: '3',
  title: 'blog 3',
  author: 'professor x',
  url: 'reddit.com',
  likes: 10,
  __v: 0
}];

const listWithFiveBlogs = [{
  _id: '5a422aa71b54a676234d17f8',
  title: 'Go To Statement Considered Harmful',
  author: 'Edsger W. Dijkstra',
  url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
  likes: 5,
  __v: 0
},
{
  _id: '2',
  title: 'blog 2',
  author: 'wolverine',
  url: 'google.com',
  likes: 0,
  __v: 0
},
{
  _id: '3',
  title: 'blog 3',
  author: 'professor x',
  url: 'reddit.com',
  likes: 10,
  __v: 0
},
{
  _id: '4',
  title: 'blog 4',
  author: 'wolverine',
  url: 'google.com',
  likes: 15,
  __v: 0
},
{
  _id: '5',
  title: 'blog 5',
  author: 'wolverine',
  url: 'google.com',
  likes: 3,
  __v: 0
}];

const sampleBlogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0
  }
];

// TOTAL LIKES
describe('total likes', () => {
  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.getTotalLikes(listWithOneBlog);
    expect(result).toBe(5);
  });

  test('when list empty, count is 0', () => {
    const result = listHelper.getTotalLikes(listWithNoBlog);
    expect(result).toBe(0);
  });

  test('list of three blogs returns total sum', () => {
    const result = listHelper.getTotalLikes(listWithThreeBlogs);
    expect(result).toBe(15);
  });

  test('list of five blogs returns total sum', () => {
    const result = listHelper.getTotalLikes(listWithFiveBlogs);
    expect(result).toBe(33);
  });
});

// FAVORITE BLOG
describe('favorite blog', () => {
  test('empty list return null', () => {
    expect(listHelper.getFavoriteBlog(listWithNoBlog))
      .toBe(null);
  });

  test('one blog', () => {
    expect(listHelper.getFavoriteBlog(listWithOneBlog))
      .toEqual({
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        __v: 0
      });
  });

  test('three blogs', () => {
    expect(listHelper.getFavoriteBlog(listWithThreeBlogs))
      .toEqual({
        _id: '3',
        title: 'blog 3',
        author: 'professor x',
        url: 'reddit.com',
        likes: 10,
        __v: 0
      });
  });

  test('five blogs', () => {
    expect(listHelper.getFavoriteBlog(listWithFiveBlogs))
      .toEqual({
        _id: '4',
        title: 'blog 4',
        author: 'wolverine',
        url: 'google.com',
        likes: 15,
        __v: 0
      });
  });
});

// MOST BLOGS
describe('which author has the most blogs', () => {
  test('returns obj with author with most blogs', () => {
    expect(listHelper.getAuthorWithMostBlogs(sampleBlogs))
      .toEqual({
        author: 'Robert C. Martin',
        blogs: 3
      });
  });
});

// MOST LIKES
describe('which author has the most likes', () => {
  test('returns obj with author with most likes', () => {
    expect(listHelper.getAuthorWithMostLikes(sampleBlogs))
      .toEqual({
        author: 'Edsger W. Dijkstra',
        likes: 17
      });
  });
});