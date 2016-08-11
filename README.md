# glrzero
### An LR(0) parser built in JS (WIP)

This library provides classes to process a BNF grammar into an action table for an LR(0) parser. 
In the future this will then be used to build a JS parser for arbitrary grammar.

## Usage

```javascript
var Grammar = require("lib/Grammar");

ParserGenerator = new Grammar(["list","of","terminals"]);
ParserGenerator.addRules({
    "RuleName":[["list","of","terminals"],["and","RuleName"]]
});

ParserGenerator.build("StartRuleName");
```
