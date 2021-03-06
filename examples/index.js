var Grammar = require("../lib/Grammar"),
    State = require("../lib/State"),
    Diagram = require("../lib/Diagram");


var g = new Grammar(["A", "B", "C", "WS"]);

g.addRules({
    "S" : [["A","E","B","E"],["B","G"]],
    "E": [["C","F"]],
    "F": [["B"],["A","E"]],
    "G": [["WS","G"],[""]]
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
    Diagram.drawFromData(nodes,edges,document.getElementById("container"));
};

buildPreRules(g.stateOptions);
var test = new State("A","Test");
var start = g.buildTraverse("S",[test]);
Diagram.drawStateDiagram(start,
    document.getElementById('container2'));

console.log(g.toBePopulated);
g.populate();

console.log(start);

Diagram.drawStateDiagram(start,
    document.getElementById('container3'));
