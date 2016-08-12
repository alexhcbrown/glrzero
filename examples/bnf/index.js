var Grammar = require("../../lib/Grammar"),
    State = require("../../lib/State"),
    Diagram = require("../../lib/Diagram");


var g = new Grammar(["<",">","rule-name","::=","|","line-end","WS","term"]);

g.addRules({
    "syntax": [["rule","syntax"],["rule"]],
    "rule": [[
        "opt-whitespace","<","rule-name",">","opt-whitespace",
        "::=","expression","line-end"
    ]],
    "expression": [["list"],["list","opt-whitespace","|","expression"]],
    "list": [["term"],["term","opt-whitespace","list"]],
    "opt-whitespace": [["WS","opt-whitespace"],[""]]
});


/*g.addRules({
    "syntax": [["rule","syntax"],["rule"]],
    "rule": [[
        "opt-whitespace","line-end"
    ]],
    "opt-whitespace": [["WS","opt-whitespace"],[""]]
});*/

var start = g.build('syntax');

Diagram.drawStateDiagram(start,
    document.getElementById('container'));
