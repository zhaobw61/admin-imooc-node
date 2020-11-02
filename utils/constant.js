const { env } = require('./env');
const UPLOAD_PATH = env === 'dev' ? '/my-users/upload/admin-upload-ebook' : '/root/upload/admin-upload/ebook';
const OLD_UPLOAD_URL = env === 'dev' ? 'http://book.youbaobao.xyz:8089/book/res/img' : 'http://www.youbaobao.xyz/book/res/img';
const UPLOAD_URL = env === 'dev' ? 'http://book.youbaobao.xyz:8089/admin-upload-ebook' : 'http://www.youbaobao.xyz/admin-upload-ebook';
module.exports = {
    CODE_ERROR: -1,
    CODE_SUCCESS: 0,
    CODE_TOKEN_EXPIRED: -2,
    debug: true,
    PWD_SALT: 'admin_imooc_node',
    PRIVATE_KEY: 'admin_imooc_node_test_youbaobao_xyz',
    JWT_EXPIRED: 60 * 60,
    UPLOAD_PATH: UPLOAD_PATH,
    OLD_UPLOAD_URL: OLD_UPLOAD_URL,
    UPLOAD_URL: UPLOAD_URL,
    MEME_TYPE_EPUB: 'application/epub+zip'
}