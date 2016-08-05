var Grammar = require("./libs/Grammar"),
    State = require("./libs/Grammar");

var g = new Grammar(["A", "B"]);

g.addRules({

    'S' : [['S','A']]
});

console.log(g.buildActionTable("S").toTable());
