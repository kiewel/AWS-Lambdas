
const result = dotenv.config();
 
if (result.error) {
  throw result.error
}

module.exports = {
  "aws": {
    "bucket": process.env['WORK_BUCKET'],
    "region": process.env['WORK_REGION']
  },
  "paths": {
    "root": "../",
    "sources": "src/",
    "temp": "_temp/",
    "results": "build/"
  },
  "dirs": {
    "metalsmith": "metalsmith/",
    "layouts": "layouts/",
    "contents": "contents/"
  },
  "files": {
    "scriptsSource": "main.js",
    "scriptsResults": "scripts.js",
    "scriptsResultsMin": "scripts.min.js",
    "stylesSource": "main.scss",
    "stylesResults": "styles.css",
    "twigGlobals": "_globals.json"
  },
  "settings": {
    "twig": true,
    "constFilenames": false,
    "draft": false,
    "verbose": false
  },
  "metadata": {
    "title": process.env['META_TITLE'],
    "description": process.env['META_DESCRIPTION'],
    "url": process.env['SITE_URL'],
    "sitemap": "sitemap.xml",
    "author": {
      "login": process.env['SITE_URL'],
      "name": process.env['SITE_AUTHOR_NAME'],
      "url": process.env['SITE_AUTHOR_URL'],
      "twitter": process.env['SITE_AUTHOR_TWITTER'],
      "email": process.env['SITE_AUTHOR_EMAIL'],
      "github": process.env['SITE_AUTHOR_GITHUB'],
      "rss": process.env['SITE_AUTHOR_RSS']
    }
  },
  "metadata-feed": {
    "title": process.env['RSS_META_TITLE'],
    "description": process.env['RSS_META_DESCRIPTION'],
    "feed_url": process.env['RSS_META_FEED_URL'],
    "site_url": process.env['RSS_META_SITE_URL'],
    "image_url": process.env['RSS_META_IMAGE_URL'],
    "managingEditor": process.env['RSS_META_EDITOR'],
    "webMaster": process.env['RSS_META_WEBMASTER'],
    "copyright": process.env['RSS_META_COPYRIGHT'],
    "language": process.env['RSS_META_LANGUAGE'],
    "categories": process.env['RSS_META_CATEGORIES'].split(',')
  }
};
