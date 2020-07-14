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

app.get('/api/wipusers', function (req, res) {
    // connect to your database
    sql.connect(config, function (err) {
        if (err) console.log(err);
        // create Request object
        var request = new sql.Request();
        // query to the database and get the records
        let strSQL = "select u.DomainUserName designerID, MIN(CONVERT(datetime, SWITCHOFFSET(CONVERT(datetimeoffset, p.DesignerStartTime), DATENAME(TzOffset, SYSDATETIMEOFFSET())))) AS loginOnIST, MAX(CONVERT(datetime, SWITCHOFFSET(CONVERT(datetimeoffset, p.DesignerEndTime), DATENAME(TzOffset, SYSDATETIMEOFFSET())))) AS logOutOnIST, CAST(MAX(p.DesignerEndTime) - MIN(p.DesignerStartTime) as time(0)) clockedHours,cast(DATEADD(ms, SUM(DATEDIFF(ms, '00: 00: 00.000', p.DesignerActiveTime)), '00: 00: 00.000') as time) as actualHours, p.DesignerWorkstation from Processing p join AspNetUsers u on u.Id = p.DesignerId join Files f on f.ProcessingId=p.HistoryId where CAST(p.DesignerStartTime as date) = '2020/05/16' and p.WasRejected = 0 and p.DesignerEndTime is not null and f.ComplexityId!=0 and f.IsOriginal=1 and f.ProcessingId IS NOT NULL GROUP BY u.DomainUserName, p.DesignerWorkstation order by u.DomainUserName"
        request.query(strSQL, function (err, recordset) {
            if (err) console.log(err)
            res.send(recordset.recordsets[0]);
        });
    });
});


app.get('/api/filestatus', function (req, res) {
    // connect to your database
    sql.connect(config, function (err) {
        if (err) console.log(err);
        // create Request object
        var request = new sql.Request();
        // query to the database and get the records
        let strSQL = 'Select ps.Status, Count(f.FileName) fileCount from jobs j join Files f on f.JobId = j.Id join Processing p on f.ProcessingId = p.HistoryId join AspNetUsers u on u.Id = p.DesignerId join ProcessingStatus ps on ps.id = p.StatusId where j.isActive = 1 and j.ReviewedOn is not null group by ps.Status, p.StatusId'
        request.query(strSQL, function (err, recordset) {
            if (err) console.log(err)
            res.send(recordset.recordsets[0]);
        });
    });
});

app.listen(port, function () {
    console.log('Server is running..');
});