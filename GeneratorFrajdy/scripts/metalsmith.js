let Metalsmith    = require('metalsmith');
let markdown      = require('metalsmith-markdown');
let layouts       = require('metalsmith-layouts');
let collections   = require('metalsmith-collections');
let define        = require('metalsmith-define');
let author        = require('metalsmith-author');
let date          = require('metalsmith-build-date');
let navigation    = require('metalsmith-navigation');
let feed          = require('metalsmith-feed');
let gravatar      = require('metalsmith-gravatar');
let sitemap       = require('metalsmith-sitemap');
let metallic      = require('metalsmith-metallic');
let publish       = require('metalsmith-publish');
let robots        = require('metalsmith-robots');
let dateFormatter = require('metalsmith-date-formatter');
let path          = require('path');

let logger        = require('./logger.js');

function generateAuthors(config) {
  let authors = {};

  authors[config.metadata.author.login] = config.metadata.author;

  config.authors = authors;
}

function generateGravatarAuthors(config) {
  let gravatarAuthors = {};

  for (var [authorName, authorObject] of Object.entries(config.authors)) {
      gravatarAuthors[authorName] = authorObject.email;
  }

  config.gravatarAuthors = gravatarAuthors;
}

function metalsmith(name, config) {
  let rootDir      = path.resolve(__dirname, config.paths.root);
  let destDir      = path.resolve(__dirname, config.paths.root, config.paths.temp);
  let contentsPath = path.resolve(__dirname, config.paths.root, config.paths.sources, config.dirs.metalsmith, config.dirs.contents);
  let layoutsPath  = path.resolve(__dirname, config.paths.root, config.paths.sources, config.dirs.metalsmith, config.dirs.layouts);


  return new Promise((resolve, reject) => {
    let compiler = Metalsmith(rootDir)
      .metadata(config.metadata)
      .source(contentsPath)
      .destination(destDir)
      .clean(false)
      .use(publish({draft: config.settings.draft}))
      .use(date())
      .use(dateFormatter({
          dates: [
              {
                  key: 'date',
                  format: 'MMMM Do YYYY'
              }
          ]
      }))
      .use(define(config))
      .use(metallic())
      .use(markdown())
      .use(navigation())
      .use(collections({
        posts: {
          sortBy: 'date',
          reverse: false
        }
      }))
      .use(feed(Object.assign({
        collection: 'posts'
      }, config['metadata-feed'])))
      .use(sitemap({
        hostname: config.metadata.url,
        output: config.metadata.sitemap,
      }))
      .use(robots({
        allow: '*',
        sitemap: config.metadata.url + config.metadata.sitemap
      }))
      .use(author({ // make sure it comes after collections
        collection: 'posts',
        authors: config.authors
      }))
      .use(gravatar(config.gravatarAuthors))
      .use(layouts({
        engine: 'handlebars',
        directory: layoutsPath
      }));

    compiler.build((err, files) => {
      if(config.settings.verbose) {
        console.log(files);
      }
      if (err) {
        logger.error(`Metalsmith ${name} [ERROR]`);
        reject(err); 
      } else {
        logger.success(`Metalsmith ${name} [SUCCESS]`);
        resolve();
      }
    });
  });
}

function build(config) {
  // Setup authors in config
  generateAuthors(config);
  generateGravatarAuthors(config);

  // Run build with valid set od posts
  if(config.settings.draft) {
    return metalsmith('drafts', config);
  } else {
    return metalsmith('published', config);
  }
}

module.exports = build;
