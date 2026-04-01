const express = require('express');
const router = express.Router();
const { body, param, validationResult } = require('express-validator');
let { books, nextId } = require('../book');

// --- Middleware to handle validation results ---
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// Validation rules
const validateBook = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('author').trim().notEmpty().withMessage('Author is required'),
    body('price').isFloat({ gt: 0 }).withMessage('Price must be a positive number'),
    body('quantity').isInt({ gt: 0 }).withMessage('Quantity must be a positive integer')
];

// 1. GET all books
router.get('/', (req, res) => {
    res.json(books);
});

// 2. GET a single book by ID
router.get('/:id', [param('id').isInt().withMessage('Invalid ID')], handleValidationErrors, (req, res) => {
    const book = books.find(b => b.id === parseInt(req.params.id));
    if (!book) return res.status(404).send('Book not found');
    res.json(book);
});

// 3. POST - Create a new book
router.post('/', validateBook, handleValidationErrors, (req, res) => {
    const newBook = { id: nextId++, ...req.body };
    books.push(newBook);
    res.status(201).json(newBook);
});

// 4. PUT - Update a book
router.put('/:id', validateBook, handleValidationErrors, (req, res) => {
    const index = books.findIndex(b => b.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ error: 'Book not found' });

    books[index] = { id: parseInt(req.params.id), ...req.body };
    res.json(books[index]);
});

// 5. DELETE - Remove a book
router.delete('/:id', (req, res) => {
    const index = books.findIndex(b => b.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ error: 'Book not found' });

    books.splice(index, 1);
    res.sendStatus(204);
});

module.exports = router;