/* ************************************************************************ */
/*
    All HTML-esque Content
*/
module.exports = function(app, db, approot) {

    var path = require('path');

    var scraper = require(path.join(approot, '/scraper/scraper.js')).scraper;

    var renderData = {
        heading: scraper.heading, // 'IoT News Scraper',
        origin:  scraper.origin   // 'http://iotweeklynews.com/'
    };

    /*
        GET /index - renders the index/landing page, it contains - 

            section heading
            label + scraped url
            issue list
    */
    app.get('/index', function(req, res) {
        db.IssueModel.find({}, function(err, issues) {
            if(err) throw err;
            if(issues.length <= 0) {
                // perform a "first" scrape
                scraper.scrapeIt(db, function(isNew) {
                    db.IssueModel.find({}, function(err, issues) {
                        if(err) throw err;
                        renderIndex(res, issues);
                    });
                });
            } else {
                if(req.query.isnew !== undefined) renderIndex(res, issues, req.query.isnew);
                else renderIndex(res, issues);
            }
        });
    });

    function renderIndex(res, issues, newScrape) {
        // copy the needed issue info to the render data
        //renderData.issues = JSON.parse(JSON.stringify(issues));
        var messageHTML;

        if(newScrape !== undefined) {
            if(newScrape === 'true') messageHTML = '<i>New scrape data is available!</i>';
            else messageHTML = '<i>There is no new scrape data.</i>';
        }

        var scrapeData = Object.assign({}, renderData, {scrapemessage: messageHTML, issues : JSON.parse(JSON.stringify(issues))});
        // render the page
        res.render('index', scrapeData);
    };
};

