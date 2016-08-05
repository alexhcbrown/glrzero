var State = require("./State.js");

function Grammar(terminals, rules) {
    this.terminals = [];
    this.rules = {};
    this.states = [];
    this.addTerminals(terminals || []);
    this.addRules(rules || {});
}

Grammar.prototype = {
    addTerminals : function(terminals) {
        this.terminals = this.terminals.concat(terminals);
    },
    addRules : function(rules) {
        Object.assign(this.rules, rules);
    },
    isTerminal : function(t) {
    		return this.terminals.indexOf(t) > -1;
    },
    digest : function(start,pT) {
		var rule = this.rules[start],
    		post = pT || [],
            s,
            op,
            loopdef = false,
            loopop = [],
            retops = [];
        for(var i = 0; i < rule.length; i++) {
            op = post.slice(0);
            for(var j=0; j<rule[i].length; j++) {
        		if(this.isTerminal(rule[i][j])) {
            		s = new State(rule[i][j]);
                    if(loopdef) {
                        loopop.push(s);
                        op = [s];
                        loopdef = false;
                    }
                    else {
                		s.addStates(op);
                		op = [s];
                    }
                }
                else {
            		if(rule[i][j] === start) {
                		loopdef = true;
                    }
                    else {
                		if(loopdef) {
                    		op = this.digest(rule[i][j],[]);
                            loopop = loopop.concat(op);
                            loopdef = false;
                        }
                		else op = this.digest(rule[i][j],op);
                    }
                }
            }
            // need to merge all the states into retop
            retops = State.merge(retops, op);
        }
        loopop.forEach(function(op) {
        		op.addStates(retops);
        });
        console.log(retops);
        return retops;
    },
    buildActionTable : function(startSymbol) {
        var start = new State("", startSymbol),
            accept = new State("$", "a");
        start.addStates(this.digest(startSymbol,[accept]));
        return start;
    }
}
module.exports = Grammar;
