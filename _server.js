var express = require('express');
var app = express();
var port = 5000;
var cors = require('cors');
app.use(cors());

var sql = require("mssql");
// config for your database
var config = {
    user: 'BRProcessor',
    password: 'Welc0me@',
    server: '192.168.0.220',
    database: 'Lumen',
};

app.get('/wipusers', function (req, res) {
    // connect to your database
    sql.connect(config, function (err) {
        if (err) console.log(err);
        // create Request object
        var request = new sql.Request();
        // query to the database and get the records
        request.query('SELECT * FROM mTeam order by designerID', function (err, recordset) {
            if (err) console.log(err)
            res.send(recordset.recordsets[0]);
        });
    });
});

// app.get('/filestatus', function (req, res) {
//     // connect to your database
//     sql.connect(config, function (err) {
//         if (err) console.log(err);
//         // create Request object
//         var request = new sql.Request();
//         // query to the database and get the records
//         let strSQL = 'Select ps.Status, Count(f.FileName) fileCount from jobs j join Files f on f.JobId = j.Id join Processing p on f.ProcessingId = p.HistoryId join AspNetUsers u on u.Id = p.DesignerId join ProcessingStatus ps on ps.id = p.StatusId where j.isActive = 1 and j.ReviewedOn is not null group by ps.Status, p.StatusId'
//         request.query(strSQL, function (err, recordset) {
//             if (err) console.log(err)
//             res.send(recordset.recordsets[0]);
//         });
//     });
// });

app.listen(port, function () {
    console.log('Server is running..');
});