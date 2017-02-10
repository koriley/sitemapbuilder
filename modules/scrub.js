const xRay = require('x-ray');
var x = xRay();

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

var getLinks = (url) => {
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

function getBody(url) {

  x(url, '*')(function(err, body) {
    //console.log(body);
    if (!body) {
      something = "noStuff";
    } else {
      something = "stuff";
    }
    //console.log(url);
    //  console.log(body.replace(/\r|\n|\t/g, ""));
  });
  //return something;
  return body;
}
module.exports.getLinks = getLinks;
