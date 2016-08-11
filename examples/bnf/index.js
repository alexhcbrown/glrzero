var Grammar = require("../../lib/Grammar"),
    State = require("../../lib/State"),
    Diagram = require("../../lib/Diagram");


var g = new Grammar(["A","WS"]);

g.addRules({

    'Start' : [["A","OptionalWhitespace",'A']],
    'OptionalWhitespace' : [['WS',"OptionalWhitespace"],['']]
});

var start = g.build('Start');

Diagram.drawStateDiagram(start,
    document.getElementById('container'));
