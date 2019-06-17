const MongoClient = require('mongodb').MongoClient
var dbs = {};
// Note: A production application should not expose database credentials in plain text.
// For strategies on handling credentials, visit 12factor: https://12factor.net/config.
const PROD_URI = "mongodb://localhost:27017"
// const MKTG_URI = "mongodb://<dbuser>:<dbpassword>@<host1>:<port1>,<host2>:<port2>/<dbname>?replicaSet=<replicaSetName>"

//var dbs = {production: {}};



function connect(url) {
    return MongoClient.connect(url).then(client => client.db(WebDB));
   // return MongoClient.connect(url)
}


// exports.initdb = async function () {
//     // let databases = await Promise.all([connect(PROD_URI), connect(MKTG_URI)])
//    // let database = await connect(PROD_URI);
//     console.log('Load initdb');
//     let database = await connect(PROD_URI, {useNewUrlParser: true}, function(err, db) {
//         if(err)
//             console.log('Load error');
//         else
//         {
//             console.log('Load success');
//             dbs = db.db();
//             //dbs = db.db();
//             // var db2 = db.db();
//             // dbs.production = db2;
//         }
// //     assert.equal(null, err);
// //
//     });
//     //dbs.production = database;
//
//     return dbs;
// }


exports.dbs =  async function (req, res, next) {
    // let databases = await Promise.all([connect(PROD_URI), connect(MKTG_URI)])
     let database = await connect(PROD_URI);
     dbs=database;
    console.log('Load initdb');
//     let database = await connect(PROD_URI, {useNewUrlParser: true}, function(err, db) {
//         if(err)
//             console.log('Load error');
//         else
//         {
//             console.log('Load success');
//             dbs = db.db();
//             //dbs = db.db();
//             // var db2 = db.db();
//             // dbs.production = db2;
//         }
// //     assert.equal(null, err);
// //
//     });
    //dbs.production = database;

    return dbs;
};