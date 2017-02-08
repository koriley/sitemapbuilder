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

if (argv.name === undefined) {
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
  fs.writeFile("logs/errorLogQueue.txt", queueError, (err) => {
    if (err) {
      return console.log(err);
    }
  });
  fs.writeFile("logs/errorLogSata.txt", errorData, (err) => {
    if (err) {
      return console.log(err);
    }
  });
});

generator.on('fetch', (status, url) => {
  console.log("fetch" + status + " " + url);
  fs.writeFile("logs/statusLog.txt", status + ' ' + url, (err) => {
    if (err) {
      return console.log(err);
    }
  });
  // fs.writeFile("logs/errorLogSata.txt", errorData, (err)=>{
  //   if(err){
  //     return console.log(err);
  //   }
  // });
});

//start the crawler
generator.start();
