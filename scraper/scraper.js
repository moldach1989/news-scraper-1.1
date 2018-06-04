/* ************************************************************************ */
/*
    Scraper - scrapes desired content from a target site. 
*/
exports.scraper = (function() { 

    var request = require('request');
    var cheerio = require('cheerio');
    var path = require('path');

    var scrapetarget = require(path.join(__dirname, './scrapetarget.js'));

    scraper = {
        heading: scrapetarget.heading,
        origin: scrapetarget.origin,
        targets: scrapetarget.targets,
        targetIdx: -1,
    };

    var $;

    /* ******************************************************************** */
    /*
        Scrap It - Loads a specific page from a target site and examines it 
        to determine if there's any "new" data. It determines that by 
        comparing content that changes when a new "issue" is present. And
        if there is a new "issue" then the page's DOM is navigated and 
        select pieces of content are copied, collected and written to a 
        collection. 
    */
    scraper.scrapeIt = function(db, callback) {

        request(scraper.origin, function(error, response, html) {
            
            $ = cheerio.load(html);

            var issueID = $('div.i > h1 > a').text();

            // check the issue collection, if found then just
            // execute the callback
            //issueID = 'dev-test';
            db.IssueModel.findOne({'issue': issueID.trim()})
            .exec(function (err, doc) {
                if(err) throw err;
                if(!doc) {
                    var tmp = db.IssueModel({issue: issueID.trim()});
                    tmp.save(function (err, doc) {
                        if (err) return console.error(err);           
                        for(scraper.targetIdx = 0; scraper.targetIdx < scraper.targets.length; scraper.targetIdx++) {
                            scrapeTarget(db, doc._id, scraper.targets[scraper.targetIdx].category, scraper.targets[scraper.targetIdx].tag);
                        }
                        callback(true);
                    });
                } else callback(false);
            });
        });
    };

    /* ******************************************************************** */
    /*
        Scrape the Target - "Scrapes" the bulk of the desired content from
        the target, orgainizes it and writes it the collection.
    */
    function scrapeTarget(db, issueId, cat, targ) {
        console.log('issueId = '+issueId);
        $('div.issue__body > section.'+targ+' > div.i > div.item').each(function(i, element) {
            var newScrape = {
                category: cat,
                link: $("h3.item__title", element).html(),
                title: $("h3.item__title", element).text(),
                body: $("p", element).text(),
                image: $("a > img", element).parent().html(),
                issue: issueId
            };
            
            newScrape.link = addTarget(newScrape.link, '_blank');
            console.log(newScrape.link);
            
            var tmp = new db.ItemModel(newScrape);
            tmp.save(function (err, doc) {
                if (err) return console.error(err);
                db.IssueModel.findOneAndUpdate({_id: issueId},
                                               {$push:{'items':doc._id, $sort: 1}}, 
                                               {new: true}, 
                    function(err, newIssue) {
                        console.log(newIssue);
                    }
                );
            });
        });
    };
    
    function addTarget(link, target) {
        // This function assumes that 'target="????"' is in the
        // link passed in. It will look for the first '>' and
        // place the target directive there. For this application
        // it is also assumed that links will look like - 
        //
        // <a href="http://cur.at/gtLeBbQ?m=web">Semiconductor Engineering and IoT Myth Busting</a>
        //                                     ^^
        // The insert will occur bewtween the ^^ above.
        // 
        var pos1  = link.search('>');
        var front = link.substring(0, pos1);
        var back  = link.substring(pos1, link.length);
        var temp = front + ' target="' + target + '"' + back;
        return temp;
    };

    return scraper;
})();

