var Temp = [
    { "ProductionDate": "2020-05-21", "Specification_Id": "23811_001", "fileCNT": 18 },
    { "ProductionDate": "2020-05-21", "Specification_Id": "24392_001", "fileCNT": 8 },
    { "ProductionDate": "2020-05-21", "Specification_Id": "47261_001", "fileCNT": 6 },
    { "ProductionDate": "2020-05-21", "Specification_Id": "50562_001", "fileCNT": 100 },
    { "ProductionDate": "2020-05-22", "Specification_Id": "24392_001", "fileCNT": 8 },
    { "ProductionDate": "2020-05-22", "Specification_Id": "24392_003", "fileCNT": 8 },
    { "ProductionDate": "2020-05-22", "Specification_Id": "39300_001", "fileCNT": 10 },
    { "ProductionDate": "2020-05-22", "Specification_Id": "39300_002", "fileCNT": 150 },
    { "ProductionDate": "2020-05-22", "Specification_Id": "47261_001", "fileCNT": 240 },
    { "ProductionDate": "2020-05-22", "Specification_Id": "50562_001", "fileCNT": 99 }
]
var data2 = this.fileTraffic.map(lblData => {
    if (Temp.indexOf(lblData.ProductionDate) === -1 && Temp.indexOf(lblData.Specification_Id) === -1) {
        var tmp = {};
        var t = [];
        t.push(lblData.fileCNT)
        tmp.label = lblData.Specification_Id;
        tmp.backgroundColor = "rgba(255,99,132,0.2)";
        tmp.borderColor = "rgba(255,99,132,1)";
        tmp.borderWidth = 1;
        tmp.hoverBackgroundColor = "rgba(255,99,132,0.4)";
        tmp.hoverBorderColor = "rgba(255,99,132,1)";
        tmp.data = t;
        Temp.push(tmp)
    }
    console.log(Temp);
    lblData = Temp;
    return lblData
});
console.log(data2);