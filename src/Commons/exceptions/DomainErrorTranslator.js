const InvariantError = require('./InvariantError');

const DomainErrorTranslator = {
  translate(error) {
    return DomainErrorTranslator._directories[error.message] || error;
  },
};

DomainErrorTranslator._directories = {
  'REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada'),
  'REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat membuat user baru karena tipe data tidak sesuai'),
  'REGISTER_USER.USERNAME_LIMIT_CHAR': new InvariantError('tidak dapat membuat user baru karena karakter username melebihi batas limit'),
  'REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER': new InvariantError('tidak dapat membuat user baru karena username mengandung karakter terlarang'),
  'USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('harus mengirimkan username dan password'),
  'USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('username dan password harus string'),
  'REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN': new InvariantError('harus mengirimkan token refresh'),
  'REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('refresh token harus string'),
  'DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN': new InvariantError('harus mengirimkan token refresh'),
  'DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('refresh token harus string'),
  'ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat menambah thread karena properti yang dibutuhkan tidak lengkap'),
  'ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat menambah thread karena tipe data tidak sesuai'),
  'GET_THREAD_DETAILS.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat mengambil thread karena properti yang dibutuhkan tidak lengkap'),
  'GET_THREAD_DETAILS.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat mengambil thread karena tipe data tidak sesuai'),
  'VERIFY_THREAD.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat mencari thread karena properti yang dibutuhkan tidak lengkap'),
  'VERIFY_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat mencari thread karena tipe data tidak sesuai'),
  'ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat menambah komentar karena properti yang dibutuhkan tidak lengkap'),
  'ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat menambah komentar karena tipe data tidak sesuai'),
  'GET_COMMENTS.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat mengambil komentar karena properti yang dibutuhkan tidak lengkap'),
  'GET_COMMENTS.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat mengambil komentar karena tipe data tidak sesuai'),
  'VERIFY_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat mencari komentar karena properti yang dibutuhkan tidak lengkap'),
  'VERIFY_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat mencari komentar karena tipe data tidak sesuai'),
};

module.exports = DomainErrorTranslator;
