const GetThreadDetails = require('../../../Domains/threads/entities/GetThreadDetails');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const GetComments = require('../../../Domains/comments/entities/GetComments');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const GetThreadDetailUseCase = require('../GetThreadDetailUseCase');

describe('GetDetailThreadUseCase', () => {
  it('should orchestrating the get detail thread action correctly', async () => {
    // Arrange
    const mockThreadDetail = {
      id: 'thread-123',
      title: 'judul thread',
      body: 'isi thread',
      date: '2023-07-07',
      username: 'dicoding',
    };
    const mockComments = [
      {
        id: 'comment-123',
        username: 'dicoding',
        date: '2023-07-07',
        content: 'komentar dicoding',
        is_deleted: false,
      },
      {
        id: 'comment-234',
        username: 'dicoding',
        date: '2023-08-08',
        content: 'komentar lain dicoding',
        is_deleted: true,
      },
    ];
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    mockThreadRepository.getThreadDetails = jest.fn(() => Promise.resolve(mockThreadDetail));
    mockCommentRepository.getComments = jest.fn(() => Promise.resolve(mockComments));
    const getThreadDetailUseCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const threadDetails = await getThreadDetailUseCase.execute('thread-123');

    // Assert
    expect(threadDetails).toStrictEqual(new GetThreadDetails({
      id: 'thread-123',
      title: 'judul thread',
      body: 'isi thread',
      date: '2023-07-07',
      username: 'dicoding',
      comments: [
        new GetComments({
          id: 'comment-123',
          username: 'dicoding',
          date: '2023-07-07',
          content: 'komentar dicoding',
          is_deleted: false,
        }),
        new GetComments({
          id: 'comment-234',
          username: 'dicoding',
          date: '2023-08-08',
          content: '**komentar telah dihapus**',
          is_deleted: true,
        }),
      ],
    }));

    expect(mockThreadRepository.getThreadDetails).toBeCalledWith('thread-123');
    expect(mockCommentRepository.getComments).toBeCalledWith('thread-123');
  });
});
