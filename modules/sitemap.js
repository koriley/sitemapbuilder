const sitemap = require('sitemap-generator');
const fs = require('fs');
var counter = 0;
var genSiteMap = (url, inputName) => {
    return new Promise((resolve, reject) => {
        var generator = new sitemap(url);
        //when the sitemap is finished going through the site.
        generator.on('done', (sitemap) => {
            //console.log(sitemap); // => prints xml sitemap
            fs.writeFile("xml_files/" + inputName + ".xml", sitemap, function(err) {
                if (err) {
                    reject(err);
                }
                resolve("The file was saved!");
            });
        });
        generator.on('clienterror', (queueError, errorData) => {
            reject(`There was an error ${queueError} || ${errorData}`)
            fs.writeFile("logs/" + inputName + "-errorLogQueue.txt", queueError + ' ' + errorData + '\r', (err) => {
                if (err) {
                    reject(err);
                }
            });
        });
        //while its going through all the urls associated with the site (internal)
        generator.on('fetch', (status, url) => {
            counter = counter + 1
            //Create a log file of all the internal urls found.
            fs.writeFile("logs/" + inputName + "-statusLog.txt", counter + ' ' + status + ' ' + url + '\r', {
                flag: 'a'
            }, (err) => {
                if (err) {
                    reject(err);
                }
            });
            //create a log of all the not so good internal urls
            if (status === "Not Found") {
                fs.writeFile("logs/" + inputName + "-brokenLinks.txt", counter + ' ' + status + ' ' + url + '\r', {
                    flag: 'a'
                }, (err) => {
                    if (err) {
                        reject(err);
                    }
                });
            }
        });

        //start the crawler
        generator.start();
    });
}

module.exports.genSiteMap = genSiteMap;
