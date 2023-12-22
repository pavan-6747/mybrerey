const express = require('express');
const router = express.Router();
const multer = require('multer');
// const path = require('path');
const fs = require('fs');
const Book = require('../models/book');

const Author = require('../models/author')
// const Book = require('../models/book')
// const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
const uploadPath = 'public/' + Book.coverImageBasePath;
fs.mkdirSync(uploadPath, { recursive: true });

const storage=multer.diskStorage({
    destination:function(req,file,cb)
    {
        cb(null,"public/uploads/bookCovers")
    },
    filename:function(req,file,cb)
    {
        cb(null,file.originalname)
    }
})

const upload = multer({storage:storage})

//All Books Route
router.get('/', async (req, res) => {
    let query = Book.find()
    if(req.query.title != null && req.query.title != ''){
        query = query.regex('title', new RegExp(req.query.title, 'i'))
    }
    if(req.query.publishedBefore != null && req.query.publishedBefore != ''){
        query = query.lte('publishDate', req.query.publishedBefore)
    }
    if(req.query.publishedAfter != null && req.query.publishedAfter != ''){
        query = query.gte('publishDate', req.query.publishedAfter)
    }
    try {
        const books = await query.exec({})
        res.render('books/index', {
            books: books,
            searchOptions: req.query
        })

    } catch{
        res.redirect('/')
    }
    
   
    
});

// New Book Route
router.get('/new', async(req, res) => {
    renderNewPage(res, new Book())
    
});
// Create Book Route
router.post('/',  upload.single('cover'), async (req, res) => {
    console.log(req);
    let fileName = req.file ? req.file.filename : null;
    
    
    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        publishDate:new Date(req.body.publishDate),
        pageCount: req.body.pageCount,
        coverImageName: fileName,
        description: req.body.description
    })
    
    try{
        if(fileName) {
            console.log(`File uploaded successfully: ${fileName}`);
        } else {
            console.log('No file uploaded.');
        } 
        const newBook = await book.save()
         // res.redirect(`books/${newBook.id}`)
         res.redirect(`books`)
    } catch(error) {
        console.error(error.message);
        res.status(500).render('error', { errorMessage: 'Internal Server Error' });
            renderNewPage(res, book, true)

    }

});
async function renderNewPage(res, book, hasError = false){
    try {
        const authors = await Author.find({})
        const params = {
            authors: authors,
            book: book

        }
        if (hasError) params.errorMessage = 'Error Creating Book'
        // const book = new Book()
        res.render('books/new', params)

    }catch {
        res.redirect('/books')

    }
}




module.exports = router;