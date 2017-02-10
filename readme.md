<b>Site Map Builder v0.0.3</b>

This is a lite weight, command line, nodejs application that will build an xml site map of a site. It does not go into any ?foo=bar arguments, but keeps to the main pages.

<b>Use Example:</b>

From the command line type "node app.js -u 'http://www.something.com' -n 'filename'" This will create an .xml document with your filename in the xml_files/ directory.

<b>Help:</b>
node app.js -h

default name (sitemap.xml):
node app.js -u "http://www.something.com"


<b>Motivation:</b>

Working on big sites with no site map, and most site map applications I found cost money. Why should I pay when I can code?

<b>Todo:</b>

  1) Add tests<br/>
  2) Once all methods work, build a desktop enterface


<b>updates:</b>
2.9.17 - Added ability to scrape page, it just outputs to screen right now.<br/>
2.10.17 - Found issues with recording the body of the web page. Think this might be
because I was trying to create the JSON on the fly as the sitemap was being built.
Am going to move this out and have it run if a flag is thrown after the sitemap.xml is created.<br/>
