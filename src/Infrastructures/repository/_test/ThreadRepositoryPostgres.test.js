const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const VerifyThread = require('../../../Domains/threads/entities/VerifyThread');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('ThreadRepositoryPostgres', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({ id: 'user-123' });
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('addThread function', () => {
    it('should persist add thread and return added thread correctly', async () => {
      // Arrange
      const thread = new AddThread({
        title: 'judul thread',
        body: 'isi thread',
        owner: 'user-123',
      });
      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedThread = await threadRepositoryPostgres.addThread(thread);

      // Assert
      const threads = await ThreadsTableTestHelper.verifyThread('thread-123');
      expect(threads).toHaveLength(1);
      expect(addedThread).toStrictEqual(new VerifyThread({
        id: 'thread-123',
        title: 'judul thread',
        owner: 'user-123',
      }));
    });
  });

  describe('getThreadDetails function', () => {
    it('should throw NotFoundError when the thread not found', async () => {
      // arrange
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // action and assert
      await expect(threadRepositoryPostgres.getThreadDetails('thread-234')).rejects.toThrowError('Thread not Found!');
    });

    it('should return a threadDetails correctly', async () => {
      // Arrange
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action
      const threadDetails = await threadRepositoryPostgres.getThreadDetails('thread-123');

      // Assert
      expect(threadDetails).toStrictEqual({
        id: 'thread-123',
        title: 'judul thread',
        body: 'isi thread',
        username: 'dicoding',
        date: '2023-07-07',
      });
    });
  });

  describe('verifyThread function', () => {
    it('should throw NotFoundError when thread not exist', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      // Action and Assert
      await expect(threadRepositoryPostgres.verifyThread('thread-123'))
        .rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when threadId exist', async () => {
      // Arrange
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      // Action and Assert
      await expect(threadRepositoryPostgres.verifyThread('thread-123'))
        .resolves.not.toThrowError(NotFoundError);
    });
  });
});
