/* ************************************************************************ */
/*
    Issue Schema - The publication issue obtained from the scraped data                                   
*/
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var issueSchema= new Schema({
    // for example - "ISSUE 96 February 8th 2017"
    issue: String,
    // list of linked news items
    items: [{type: Schema.Types.ObjectId, ref: 'Item'}]
});

var IssueModel = mongoose.model('Issue',issueSchema);

module.exports=IssueModel; 

