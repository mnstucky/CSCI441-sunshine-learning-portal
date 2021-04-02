const {
  getThreads,
  getUserById,
  getUnreadPostCount,
  getTotalPosts,
  getPosts,
} = require("../model/db");

async function getAndFormatThreads() {
  const threads = await getThreads();
  const asyncFormattedThreads = threads.map(async (thread) => {
    const studentId = thread.studentid;
    const student = await getUserById(studentId);
    let unreadPostCount = await getUnreadPostCount(thread.threadid);
    unreadPostCount = unreadPostCount[0].count;
    let totalPostCount = await getTotalPosts(thread.threadid);
    totalPostCount = totalPostCount[0].count;
    return {
      ...thread,
      firstName: student.firstname,
      lastName: student.lastname,
      unreadPostCount,
      totalPostCount,
    };
  });
  const formattedThreads = await Promise.all(asyncFormattedThreads);
  return formattedThreads;
}

async function getAndFormatPosts(threadId) {
  const posts = await getPosts(threadId);
  const asyncFormattedPosts = posts.map(async (post) => {
    const studentId = post.studentid;
    const student = await getUserById(studentId);
    return {
      ...post,
      firstName: student.firstname,
      lastName: student.lastname,
    };
  });
  const formattedPosts = await Promise.all(asyncFormattedPosts);
  return formattedPosts;
}

exports.getAndFormatThreads = getAndFormatThreads;
exports.getAndFormatPosts = getAndFormatPosts;
