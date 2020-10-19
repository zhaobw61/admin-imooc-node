const {
    MEME_TYPE_EPUB,
    UPLOAD_PATH,
    UPLOAD_URL
} = require('../utils/constant');

const fs = require('fs');

class Book {
    constructor(file, data) {
        if(file) {
            this.createBookFromFile(file);
        } else {
            this.createBookFromData(data);
        }
    }

    createBookFromFile(file) {
        const {
            destination,
            filename,
            mimetype = MEME_TYPE_EPUB,
            path,
            originalName
        } = file;
        // 电子书的后缀名
        const suffix = mimetype === MEME_TYPE_EPUB ? '.epub' : '';
        // 电子书原有的文件路径
        const oldBookPath = path;
        // 电子书的新路径
        const bookPath = `${destination}/${filename}${suffix}`;
        // 电子书下载路径
        const url = `${UPLOAD_URL}/book/${filename}${suffix}`;
        // 电子书解压后的路径
        const unzipPath = `${UPLOAD_PATH}/unzip/${filename}`;
        // 电子书解压后得文件夹RUL
        const unzipUrl = `${UPLOAD_URL}/unzip/${filename}`;
        const tempPath = `${UPLOAD_PATH}/unzip`;
        if(!fs.existsSync(tempPath)) {
            fs.mkdirSync(tempPath, {recursive: true});
        }
        if(!fs.existsSync(unzipPath)) {
            fs.mkdirSync(unzipPath, {recursive: true});
        }
        if(!fs.existsSync(unzipPath)) {
            fs.mkdirSync(unzipPath, {recursive: true});
        }
        if(fs.existsSync(oldBookPath) && !fs.existsSync(bookPath)) {
            fs.renameSync(oldBookPath, bookPath);
        }
        // C:\my-users\upload\admin-upload-ebook\book
        // C:\my-users\upload\admin-upload-ebook\unzip\6d006ea8379a2a4b3b5840f48a627731
        this.fileName = filename; // 文件名
        this.path = `/book/${filename}${suffix}` // epub文件相对路径
        this.filePath = this.path;
        this.unzipPath = `/unzip/${filename}`
        this.url = url;
        this.title = ''; // 电子书的标题
        this.author = '';
        this.publisher = '';
        this.contents = []; // 目录
        this.cover = '' // 封面图片
        this.category = -1;
        this.categoryText = '';
        this.language = ''; // 语种
        this.unzipUrl = unzipUrl;
        this.originalName = originalName; // 原文件的原名
    }

    createBookFromData(data) {

    }
}

module.exports = Book;