/* ************************************************************************ */
/*
    All Server Routes
*/
'use strict'

// add/modify items as needed...
const routes = [
    require('./routes/html.js'),
    require('./routes/api.js'),
    // NOTE: standard.js MUST be last!
    require('./routes/standard.js')
];

// Add access to the app, db object and application
// root to each route
module.exports = function router(app, db, approot) {
    return routes.forEach((route) => {
        route(app, db, approot);
    });
};

