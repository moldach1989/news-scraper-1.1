/* ************************************************************************ */
/*
    Server Routing - Standard/default route handling, favicon.ico, static
    paths, and redirects unknown paths to the default path /index.
*/
'use strict';

module.exports = (app, db, approot) => {
    /*
        Set up the resource path for static files....
    
        The best source of information I could find on how to
        do this properly was found at - 
    
            http://www.fullstacktraining.com/articles/how-to-serve-static-files-with-express
    
        One key piece of information was to use path.join(), the
        comments on the page above indicated that it is cross-
        platform and necessary when working in Windows.
    */
    var express = require('express');
    var path = require('path');
    app.use('/', express.static(path.join(approot, '/public')));
    
    /*
        Some browsers (chrome!) will always ask for the
        favicon. We won't return one, but we'll respond
        with an appropriate status.
    
        NOTE: If a favicon is desired then remove/comment
        out this code AND modify your HTML to provide an 
        icon OR send it from here (probably the easiest)
    */
    app.get('/favicon.ico', function(req, res) {
        console.log('standard.js - favicon.ico request, responding with 204');
        res.status(204).send('/favicon.ico does not exist');
    });

    // route all unknown paths to /index
    app.get('*',function (req, res) {
        console.log('Server - redirecting ['+req.route.path+'] to /index');
        res.redirect('/index');
    });
};

