/* ************************************************************************ */
/*
    (News) Item Schema - The news item obtained from the scraped data, 
    includes the category of the item, the scraped link, item body, and
    the link to the item image if it had one.
*/
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var itemSchema= new Schema({
    date: {type: Date, default: Date.now},
    category: String,
    link: String,
    title: String,
    body: String,
    image: String,
    issue: {type: Schema.Types.ObjectId, ref: 'Issue'},
    comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}]
});

var ItemModel = mongoose.model('Item',itemSchema);

module.exports=ItemModel; 
