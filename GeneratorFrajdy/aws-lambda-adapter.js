let config = require('./config.js');
let build = require('./build.js');
let SyncDirS3 = require('@kociolekt/syncdirs3');
let scandir = require('scandir').create();
let mime = require('mime-types');

function showDir(dir) {
    return new Promise((resolve, reject) => {
        scandir.on('file', function(file, stats) {
            console.log(file + ' ' +  stats.size);
        });
        
        scandir.on('error', function(err){
            console.error(err);
        });
        
        scandir.on('end', function(){
            console.log('Done');
            resolve();
        });
        
        scandir.scan({
            dir: dir,
            recursive: true,
            filter: /.*/
        });
    });
}

exports.handler = async (event) => {

    let sync = new SyncDirS3({
        bucket: config.aws.bucket,
        region: config.aws.region,
        verbose: true
    });

    try {
        console.log('# downloading to /tmp/src/');
        await sync.download('/src/', '/tmp/src/');

        //console.log('# showing /tmp/src/');
        //await showDir('/tmp/src/');

        console.log('# building to /tmp/build/');
        await build(Object.assign({}, config, {
            paths: {
                root: "/tmp/",
                sources: "src/",
                temp: "_temp/",
                results: "build/"
            }
        }));

        //console.log('# showing /tmp/build/');
        //await showDir('/tmp/build/');
        
        console.log(`# uploading to bucket ${config.aws.bucket}/`);
        await sync.upload('/tmp/build/', '/', (srcPath) => {
            let contentType = mime.lookup(srcPath);

            return {
                ContentType: contentType
            };
        });
    } catch(e) {
        console.log(e);
    }

    return {
        body: 'finished!'
    };
};