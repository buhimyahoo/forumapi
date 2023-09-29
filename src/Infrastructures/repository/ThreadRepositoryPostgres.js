const ThreadRepository = require('../../Domains/threads/ThreadRepository');
const VerifyThread = require('../../Domains/threads/entities/VerifyThread');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(addThread) {
    const { title, body, owner } = addThread;
    const id = `thread-${this._idGenerator()}`;
    const date = new Date().toISOString();
    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5) RETURNING id, title, owner',
      values: [id, title, body, owner, date],
    };

    const result = await this._pool.query(query);
    return new VerifyThread({ ...result.rows[0] });
  }

  async getThreadDetails(threadId) {
    const query = {
      text: `SELECT threads.id, title, body, users.username, date
              FROM threads
              INNER JOIN users ON threads.owner = users.id
              WHERE threads.id = $1`,
      values: [threadId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new Error('Thread not Found!');
    }

    return result.rows[0];
  }

  async verifyThread(threadId) {
    const query = {
      text: 'SELECT id FROM threads WHERE id = $1',
      values: [threadId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('thread not found');
    }
  }
}

module.exports = ThreadRepositoryPostgres;
