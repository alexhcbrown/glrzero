var Grammar = require("../lib/Grammar"),
    State = require("../lib/State"),
    Diagram = require("../lib/Diagram");


var g = new Grammar(["A", "B", "C"]);

g.addRules({

    "S" : [["A","E","B","E"],["B"]],
    "E": [["C"]]
});

/*g.build('S');

Diagram.drawStateDiagram(g.stateOptions.S[0],
    document.getElementById('container'));
*/

Object.keys(g.rules).forEach(function(ruleLabel){
    this.firstPass(this.rules[ruleLabel],ruleLabel);
}, g);

function buildPreRules(sOps) {
    var nodes = [], edges = [], s, data;
    Object.keys(sOps).forEach(function(ruleLabel) {
        s = new State("", ruleLabel);
        s.addStates(sOps[ruleLabel]);
        console.log(s);
        data = Diagram.buildData(s);
        nodes = nodes.concat(data.nodes);
        edges = edges.concat(data.edges);
    });
    Diagram.drawFromData(nodes,edges,document.getElementById("container2"));
};

buildPreRules(g.stateOptions);
var test = new State("A","Test");
var start = g.buildTraverse("S",[test]);
Diagram.drawStateDiagram(start,
    document.getElementById('container'));
