var Grammar = require("./lib/Grammar"),
    State = require("./lib/State");

var g = new Grammar(["A", "B"]);

g.addRules({

    'S' : [['A','S']]
});

g.build('S');

console.log(g.stateOptions,g.stateOptions.S[0].states);
