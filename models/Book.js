const {
    MEME_TYPE_EPUB,
    UPLOAD_PATH,
    UPLOAD_URL
} = require('../utils/constant');

const fs = require('fs');
const Epub = require('../utils/epub');

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

    parse() {
        if(!fs.existsSync(`${UPLOAD_PATH}/img`)) {
            fs.mkdirSync(`${UPLOAD_PATH}/img`, {recursive: true});
        }
        return new Promise((resolve, reject) => {
            const bookPath = `${UPLOAD_PATH}${this.filePath}`;
            if(!fs.existsSync(bookPath)) {
                reject(new Error('电子书不存在'));
            }
            const epub = new Epub(bookPath);
            epub.on('error', err => {
                reject(err);
            });
            epub.on('end', err => {
                if(err) {
                    reject(err);
                } else {
                    const {
                        language,
                        creator,
                        creatorFileAs,
                        title,
                        cover,
                        publisher
                    } = epub.metadata;
                    console.log('epub', epub.metadata.title);
                    if(!title) {
                        reject(new Error('图书标题为空'));
                    } else {
                        this.title = title;
                        this.language = language || 'en';
                        this.author = creator || creatorFileAs || 'unkonwn';
                        this.publisher = publisher || 'unkonwn';
                        this.rootFile = epub.rootFile;
                        try {
                            this.unzip();
                            this.parseContents();
                            const handleGetImage = (err, file, mimeType) => {
                                if (err) {
                                    reject(err)
                                } else {
                                    const suffix = mimeType.split('/')[1]
                                    const coverPath = `${UPLOAD_PATH}/img/${this.fileName}.${suffix}`
                                    const coverUrl = `${UPLOAD_URL}/img/${this.fileName}.${suffix}`
                                    fs.writeFileSync(coverPath, file, 'binary')
                                    this.coverPath = `/img/${this.fileName}.${suffix}`
                                    this.cover = coverUrl
                                    resolve(this)
                                }
                            };
                            epub.getImage(cover, handleGetImage);
                        } catch (e) {

                        }
                    }
                }
            });
            epub.parse();
        });
    }

    unzip() {
        const AdmZip = require('adm-zip');
        const zip = new AdmZip(Book.genPath(this.path));
        zip.extractAllTo(Book.genPath(this.unzipPath), true);
    }

    parseContents(epub) {

    }

    static genPath(path) {
        if(!path.startsWith('/')) {
            path = `/${path}`;
        }
        return `${UPLOAD_PATH}${path}`;
    }

}

module.exports = Book;