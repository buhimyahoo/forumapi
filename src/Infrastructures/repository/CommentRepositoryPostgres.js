const CommentRepository = require('../../Domains/comments/CommentRepository');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const VerifyComment = require('../../Domains/comments/entities/VerifyComment');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(newComment) {
    const { threadId, owner, content } = newComment;
    const id = `comment-${this._idGenerator()}`;
    const date = new Date().toISOString();
    const isDeleted = false;
    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6) RETURNING id, owner, content',
      values: [id, threadId, owner, content, date, isDeleted],
    };

    const result = await this._pool.query(query);
    return new VerifyComment({ ...result.rows[0] });
  }

  async getComments(threadId) {
    const query = {
      text: `SELECT comments.id, users.username, content, date, is_deleted
              FROM comments
              INNER JOIN users ON comments.owner = users.id
              WHERE comments.thread_id = $1
              ORDER BY comments.date ASC`,
      values: [threadId],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }

  async deleteComment(commentId) {
    const query = {
      text: `UPDATE comments 
      SET is_deleted = TRUE
      WHERE id = $1 RETURNING id`,
      values: [commentId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('komentar tidak ada');
    }
  }

  async verifyComment({ threadId, commentId }) {
    const query = {
      text: `SELECT 1
              FROM comments
              INNER JOIN threads ON comments.thread_id = threads.id
              WHERE threads.id = $1
              AND comments.id = $2`,
      values: [threadId, commentId],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('komentar tidak ada');
    }
  }

  async verifyCommentAccess({ ownerId, commentId }) {
    const query = {
      text: 'SELECT id FROM comments WHERE id = $1 AND owner = $2',
      values: [commentId, ownerId],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new AuthorizationError('Anda tidak punya akses');
    }
  }
}

module.exports = CommentRepositoryPostgres;
