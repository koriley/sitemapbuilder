const sitemap = require('sitemap-generator');
const fs = require('fs');

const yargs = require('yargs');

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
if ((argv.name === undefined) || (argv.name === '')) {
  var inputName = "sitemap";
} else {
  var inputName = argv.name;
}

console.log(`url = ${argv.url} and name = ${inputName}`);
// generator
var generator = new sitemap(argv.url);

// register event listeners
generator.on('done', function(sitemap) {
  //console.log(sitemap); // => prints xml sitemap

  fs.writeFile("xml_files/" + inputName + ".xml", sitemap, function(err) {
    if (err) {
      return console.log(err);
    }


    console.log("The file was saved!");
  });
});

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

generator.on('fetch', (status, url) => {
  counter = counter + 1
  console.log(" fetch: " + counter + ' ' + status + " " + url);
  fs.writeFile("logs/" + inputName + "-statusLog.txt", counter + ' ' +
    status + ' ' + url +
    '\r', {
      flag: 'a'
    }, (err) => {
      if (err) {
        return console.log(err);
      }
    });
  if (status === "Not Found") {
    fs.writeFile("logs/" + inputName + "-brokenLinks.txt", counter + ' ' +
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
