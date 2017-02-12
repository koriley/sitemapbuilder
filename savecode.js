// this is the original scrubber json creating code. (doesn't really work)

var parser = new xml2js.Parser();
fs.readFile("xml_files/" + inputName + ".xml", (err, data) => {
  parser.parseString(data, (err, res) => {
    if (err) {
      console.log(err);
    }
    // console.log(JSON.stringify(res.urlset.url[0].loc[0],
    //   undefined, 2));

    if (argv.scrub) {
      console.log(
        "Starting Scrubbing, this may take a while.");
      var targetLength = res.urlset.url.length - 1;
      for (var i = 0; i <= targetLength; i++) {
        var childTargetLength = res.urlset.url[i].loc.length -
          1;
        for (var k = 0; k <= childTargetLength; k++) {
          scrubObject = {
            url: res.urlset.url[i].loc[k],
            link: scrub.getLinks(res.urlset.url[i].loc[k])
          }
        }
      }
      console.log(JSON.stringify(scrubObject, undefined, 2));
    }
  });
});

//sitemap erro and fetch code
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
