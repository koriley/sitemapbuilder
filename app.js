const sitemap = require('sitemap-generator');
const fs = require('fs');
const xRay = require('x-ray');
const yargs = require('yargs');

var x = xRay();

const argv = yargs
  .options({
    u: {
      demand: true,
      alias: 'url',
      describe: 'URL to get site map of requires full url: http://www.something.com',
      string: true
    },
    n: {
      demand: false,
      alias: 'name',
      describe: 'File name to save the xml document in. tmp/',
      string: true
    }
  })
  .help()
  .alias('help', 'h')
  .argv;
var counter = 0;
var json = {};
var jsonCount = 0;
var imgs = [];
var links = [];
//end vars

if ((argv.name === undefined) || (argv.name === '')) {
  var inputName = "sitemap";
} else {
  var inputName = argv.name;
}

console.log(`url = ${argv.url} and name = ${inputName}`);
// generator
var generator = new sitemap(argv.url);

// register event listeners

//when the sitemap is finished going through the site.
generator.on('done', function(sitemap) {
  //console.log(sitemap); // => prints xml sitemap
  fs.writeFile("xml_files/" + inputName + ".xml", sitemap, function(err) {
    if (err) {
      return console.log(err);
    }
    //here we are going to write our json file of what we found
    console.log(JSON.stringify(json, 'undefined', 2));
    //everything is done, lets tell the user.
    console.log("The file was saved!");
  });
});

//well, we got an error, lets stop and see wht happened.
generator.on('clienterror', (queueError, errorData) => {
  console.log(`There was an error ${queueError} || ${errorData}`)
  fs.writeFile("logs/" + inputName + "-errorLogQueue.txt", queueError + ' ' +
    errorData +
    '\r', (err) => {
      if (err) {
        return console.log(err);
      }
    });

});

//while its going through all the urls associated with the site (internal)
generator.on('fetch', (status, url) => {
  counter = counter + 1
    //Create a log file of all the internal urls found.
  fs.writeFile("logs/" + inputName + "-statusLog.txt", counter + ' ' +
    status + ' ' + url +
    '\r', {
      flag: 'a'
    }, (err) => {
      if (err) {
        return console.log(err);
      }
    });
  //create a json of all the good internal urls
  if (status != "Not Found") {
    console.log(url);



    links = getLinks(url);
    imgs = getImages(url);
    json[jsonCount] = {
      'url': url,
      'images': imgs,
      'links': links
    }
    jsonCount++;

  }
  //create a log of all the not so good internal urls
  if (status === "Not Found") {
    fs.writeFile("logs/" + inputName + "-brokenLinks.txt", counter +
      ' ' +
      status + ' ' + url +
      '\r', {
        flag: 'a'
      }, (err) => {
        if (err) {
          return console.log(err);
        }
      });
  }


});

function getImages(url) {
  var imgs = [];
  x(url, ['img@src'])(function(err, siteImages) {
    if (err) {
      return console.log(err);
    }

    var len = siteImages.length;

    for (var i = 0; i <= len - 2; i++) {
      imgs[i] = siteImages[i];
    }

  });
  return imgs;
}

function getLinks(url) {
  var links = [];
  x(url, ['a@href'])(function(err, pageLinks) {
    if (err) {
      return console.log(err);
    }
    var len = pageLinks.length;
    for (var i = 0; i <= len - 2; i++) {
      links[i] = pageLinks[i];

    }
  });
  return links;
}

//start the crawler
generator.start();
