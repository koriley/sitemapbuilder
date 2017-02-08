Site Map Builder v0.0.1

This is a lite weight, command line, nodejs application that will build an xml site map of a site. It does not go into any ?foo=bar arguments, but keeps to the main pages.

Use Example:

From the command line type "node app.js -u 'http://www.something.com' -n 'filename'" This will create an .xml document with your filename in the xml_files/ directory.

Help:
node app.js -h

default name (sitemap.xml):
node app.js -u "http://www.something.com"


Motivation:

Working on big sites with no site map, and most site map applications I found cost money. Why should I pay when I can code?

Todo:
  1) Add tests
  2) give it a web based interface
  3) dream of more things this can do. Any ideas?
