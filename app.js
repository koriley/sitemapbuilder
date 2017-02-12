const yargs = require('yargs');
const xml2js = require('xml2js');
const jsonfile = require('jsonfile');
var scrub = require("./modules/scrub");
var siteMap = require("./modules/sitemap");

const argv = yargs.options({
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
}).help().alias('help', 'h').argv;

var json = {};
var jsonCount = 0;
var imgs = [];
var links = [];
var body = "";
var scrubObject = {};

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
siteMap.genSiteMap(argv.url, inputName).then((res) => {
    console.log(res);
}, (errorMessage) => {
    console.log(errorMessage);
});

// register event listeners
