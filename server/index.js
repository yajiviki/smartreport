var express = require('express');
var app = express();
var port = 5000;
var cors = require('cors');
app.use(cors());
const bodyParser = require('body-parser');
const pino = require('express-pino-logger')();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(pino);

app.get('/wipusers', function (req, res) {
    var sql = require("mssql");
    // config for your database
    var config = {
        user: 'BRProcessor',
        password: 'Welc0me@',
        server: '192.168.0.220',
        database: 'BRProcessor',
    };

    // connect to your database
    sql.connect(config, function (err) {
        if (err) console.log(err);
        // create Request object
        var request = new sql.Request();
        // query to the database and get the records
        request.query('SELECT top 20 * FROM mTeam order by designerID', function (err, recordset) {
            if (err) console.log(err)
            res.send(recordset.recordsets[0]);
        });
    });
});

app.listen(port, function () {
    console.log('Server is running..');
});