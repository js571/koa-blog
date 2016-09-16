var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//类型
var TypeSchema = Schema({
    title: { type: String },
    count: {type: Number, default: 0},
    create_at: { type: Date, default: Date.now() }
});

TypeSchema.index({create_at: -1});

mongoose.model('Type', TypeSchema);