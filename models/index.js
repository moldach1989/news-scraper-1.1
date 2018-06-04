/* ************************************************************************ */
/*
    Database Connection and Model Management                                   
*/

/*
    Mongoose Setup

    Based on our run-time environment choose the appropriate 
    parameters for connecting to the database
*/
var env = process.env.NODE_ENV || 'development';
var config = require('../mongo-config.json')[env];
var mongoose = require('mongoose');
var Promise = require("bluebird");

// satisfy the deprecation warning
mongoose.Promise = Promise;

var db = {};

// The models...
db.IssueModel   = require('./issue.js');
db.ItemModel    = require('./item.js');
db.CommentModel = require('./comment.js');

// These are nice to have available elsewhere
db.mongoose = mongoose;
db.conn = mongoose.connection;

mongoose.connect(config.MONGODB_URI, function(err, data){
	if(err)
	    console.log(err);
	else{
	    console.log("connection success");
	    db.connflag = true;
	}  
});

// Show any mongoose errors
db.conn.on("error", function(error) {
    console.log("Mongoose Error: ", error);
    throw error;
});


module.exports = db;
