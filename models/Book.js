const {
    MEME_TYPE_EPUB,
    UPLOAD_PATH,
    UPLOAD_URL
} = require('../utils/constant');

const fs = require('fs');
const Epub = require('../utils/epub');
const xml2js = require('xml2js').parseString;

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
                    if(!title) {
                        reject(new Error('图书标题为空'));
                    } else {
                        this.title = title;
                        this.language = language || 'en';
                        this.author = creator || creatorFileAs || 'unkonwn';
                        this.publisher = publisher || 'unkonwn';
                        this.rootFile = epub.rootFile;
                        try {
                            this.unzip(epub);
                            this.parseContents(epub);
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
        function getNcxFilePath() {
            const spine = epub && epub.spine;
            const manifest = epub && epub.manifest;
            const ncx = spine.toc && spine.toc.href;
            const id = spine.toc && spine.toc.id;
            if(ncx){
                return ncx;
            } else {
                return manifest[id].href;
            }
        }

        function findParent(array) {
            return array.map(item => {
                return item;
            });
        }

        function flatten(array) {
            return [].concat(...array.map(item => {
                return item;
            }))
        }

        const ncxFilePath = Book.genPath(`${this.unzipPath}/${getNcxFilePath()}`);
        if(fs.existsSync(ncxFilePath)) {
            return new Promise((reslove, reject)=>{
                const xml = fs.readFileSync(ncxFilePath, 'utf-8');
                const fileName = this.fileName;
                xml2js(xml, {
                    explicitArray: false,
                    ignoreAttrs: false
                }, function(err, json) {
                    if(err) {
                        reject(err);
                    } else {
                        const navMap = json.ncx.navMap;
                        if(navMap.navPoint && navMap.navPoint.length > 0){
                            navMap.navPoint = findParent(navMap.navPoint);
                            const newNavMap = flatten(navMap.navPoint);
                            const chapters = [];
                            epub.flow.forEach((chapter, index) => {
                                if(index + 1 > newNavMap.length) {
                                    return;
                                }
                                const nav = newNavMap[index];
                                chapter.text = `${UPLOAD_URL}/unzip/${fileName}/${chapter.href}`;
                                if(nav && nav.navLabel) {
                                    chapter.label = nav.navLabel.text || '';
                                } else {
                                    chapter.label = '';
                                }
                                chapter.navId = nav['$'].id;
                                chapter.fileName = fileName;
                                chapter.order = index + 1;
                                chapters.push(chapter);
                            });
                            console.log(chapters);
                        } else {
                            reject(new Error('目录解析失败，目录数为0'));
                        }
                    }
                });
            })
        } else {
            throw new Error('目录文件不存在');
        }
    }

    static genPath(path) {
        if(!path.startsWith('/')) {
            path = `/${path}`;
        }
        return `${UPLOAD_PATH}${path}`;
    }

}

module.exports = Book;