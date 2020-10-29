const Book = require("../models/Book");
const db =  require("../db");

function exit(book) {

}

function removeBook (book) {

}

function insertContents (book) {

}

function insertBook(book) {
    return new Promise( async (reslove, reject) => {
        try {
            if (book instanceof Book) {
                const result = await exit(book);
                if(result) {
                    await removeBook(book);
                    reject(new Error('电子书已存在'));
                } else {
                    await db.insert(book, 'book');
                    await insertContents(book);
                    reslove();
                }
            } else {
                reject(new Error('添加的图书对象不合法'));
            }
        } catch (e) {
            reject(e);
        }
    })
}

module.exports = {
    insertBook
}