const mysql = require('mysql');
const mysqlConnection = mysql.createConnection({
    host:'brwjh1mfhtqyr38wnshj-mysql.services.clever-cloud.com',
    user:'urbwpeh2eqb0fxyg',
    password:'VVvTwFbqZd1Kohj7O8kn',
    database:'brwjh1mfhtqyr38wnshj'
});
mysqlConnection.connect(function(err){
    if (err) {
        console.log(err);
        return;
    } else {
        console.log('Db is connected');
    }
});

module.exports=mysqlConnection;