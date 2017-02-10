const sitemap = require('sitemap-generator');
const fs = require('fs');
const xRay = require('x-ray');
const yargs = require('yargs');
const xml2js = require('xml2js');
var scrub = require("./modules/scrub.js");


var x = xRay();

const argv = yargs
  .options({
    u: {
      demand: true,
      alias: 'url',
      describe: 'URL to create site map.',
      string: true
    },
    n: {
      demand: false,
      alias: 'name',
      describe: 'File name to save the xml document in. tmp/',
      string: true
    },
    s: {
      deman: false,
      alias: 'scrub',
      describe: "Get all the contents from each page in the map.",
      bool: true
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
var body = "";
var something;

if (argv.scrub) {
  console.log("with scrubing");
}
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
    var parser = new xml2js.Parser();
    fs.readFile("xml_files/" + inputName + ".xml", (err, data) => {
      parser.parseString(data, (err, res) => {
        if (err) {
          console.log(err);
        }
        console.log(JSON.stringify(res.urlset.url.length,
          undefined, 2));

      });
    });
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



//start the crawler
generator.start();
