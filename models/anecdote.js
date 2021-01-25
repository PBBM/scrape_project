const mongoose = require('mongoose');

const anecdoteSchema = mongoose.Schema ({
    title: { type: String, required: false },
    description: { type: String, required: false },
});

module.exports = mongoose.model('Anecdote', anecdoteSchema);