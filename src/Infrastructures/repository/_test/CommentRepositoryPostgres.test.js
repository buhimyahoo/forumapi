const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const VerifyComment = require('../../../Domains/comments/entities/VerifyComment');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

describe('CommentRepositoryPostgres', () => {
  beforeAll(async () => {
    const userId = 'user-123';
    const threadId = 'thread-123';
    await UsersTableTestHelper.addUser({ id: userId, username: 'dicoding' });
    await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('addComment function', () => {
    it('should persist new comment and return added comment correctly', async () => {
      // Arrange
      const comment = new AddComment({
        threadId: 'thread-123',
        owner: 'user-123',
        content: 'komentar dicoding',
      });
      const fakeIDGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIDGenerator);

      // Action
      const newComment = await commentRepositoryPostgres.addComment(comment);
      // Assert
      const comments = await CommentsTableTestHelper.verifyComment(newComment.id);
      expect(newComment).toStrictEqual(new VerifyComment({
        id: 'comment-123',
        content: 'komentar dicoding',
        owner: 'user-123',
      }));
      expect(comments).toHaveLength(1);
    });

    it('should return added comment correctly', async () => {
      // arrange
      const addComment = new AddComment({
        threadId: 'thread-123',
        content: 'komentar dicoding',
        owner: 'user-123',
      });

      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // action
      const addedComment = await commentRepositoryPostgres.addComment(addComment);

      // assert
      expect(addedComment).toStrictEqual(new VerifyComment({
        id: 'comment-123',
        content: 'komentar dicoding',
        owner: 'user-123',
      }));
    });
  });

  describe('deleteComment function', () => {
    it('should update is_deleted column in database to true', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({
        id: 'comment-123', threadId: 'thread-123', ownerId: 'user-123',
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      await commentRepositoryPostgres.deleteComment('comment-123');

      // Assert
      const comment = await CommentsTableTestHelper.verifyComment('comment-123');
      expect(comment[0].is_deleted).toEqual(true);
    });

    it('should throw NotFoundError when comment that want to be deleted did not exist', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Act & Assert
      await expect(commentRepositoryPostgres.deleteComment('comment-123'))
        .rejects.toThrow(NotFoundError);
    });
  });

  describe('getComments function', () => {
    it('should return empty array when comment not found', async () => {
      // arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // action
      const comments = await commentRepositoryPostgres.getComments('thread-123');

      // assert
      expect(comments).toStrictEqual([]);
    });

    it('should return all comments that belongs to the thread id', async () => {
      // Arrange
      const comment1 = {
        id: 'comment-123', content: 'komentar dicoding', date: '2023-07-07', is_deleted: false,
      };
      const comment2 = {
        id: 'comment-234', content: 'komentar lain dicoding', date: '2023-08-08', is_deleted: true,
      };

      await CommentsTableTestHelper.addComment(comment1);
      await CommentsTableTestHelper.addComment(comment2);
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      const commentList = await commentRepositoryPostgres.getComments('thread-123');

      // Assert
      expect(commentList).toStrictEqual([
        {
          id: 'comment-123',
          username: 'dicoding',
          content: 'komentar dicoding',
          date: '2023-07-07',
          is_deleted: false,
        },
        {
          id: 'comment-234',
          username: 'dicoding',
          content: 'komentar lain dicoding',
          date: '2023-08-08',
          is_deleted: true,
        },
      ]);
    });
  });

  describe('verifyComment function', () => {
    it('should throw NotFoundError when comment is not exist', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Act & Assert
      await expect(commentRepositoryPostgres.verifyComment({ threadId: 'thread-123', commentId: 'comment-123' })).rejects.toThrow(NotFoundError);
    });

    it('should not throw NotFoundError when comment is exist', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Act & Assert
      await expect(commentRepositoryPostgres.verifyComment({ threadId: 'thread-123', commentId: 'comment-123' })).resolves.not.toThrow(NotFoundError);
    });
  });

  describe('verifyCommentAccess function', () => {
    it('should throw AuthorizationError when user has no access', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({ id: 'comment-123', owner: 'user-123' });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Act & Assert
      await expect(commentRepositoryPostgres.verifyCommentAccess({ commentId: 'comment-123', ownerId: 'user-234' }))
        .rejects.toThrow(AuthorizationError);
    });

    it('should not throw AuthorizationError when user has access', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({ id: 'comment-123', owner: 'user-123' });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Act & Assert
      await expect(commentRepositoryPostgres.verifyCommentAccess({ ownerId: 'user-123', commentId: 'comment-123' }))
        .resolves.not.toThrow(AuthorizationError);
    });
  });
});
