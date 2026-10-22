/**
 * Collection of helper functions best suited for working with the describe sections of the blog list.
 */

const dummy = () => {
  return 1
}

/**
 * Receives a list of blog posts as a parameter.
 * Returns the total sum of likes in all of the blog posts.
 */
const totalLikes = (blogs) => {
  const totalLikes = blogs.reduce( (totalLikes, currentPost) => totalLikes + currentPost.likes, 0)
  return totalLikes
}

const favoriteBlog = (blogs) => {
  const favorite = blogs.reduce( (bestBlog, currentBlog) => bestBlog.likes > currentBlog.likes ? bestBlog : currentBlog, [])
  return favorite
}

const blogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0,
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url:
      'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0,
  }
]

const getAuthToken = (request) => {
  const authorizationHeader  = request.get('Authorization')
  if (authorizationHeader && authorizationHeader.startsWith('Bearer ')){
    return authorizationHeader.replace('Bearer ', '')
  }
  return null
}


module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  blogs,
  getAuthToken
}
