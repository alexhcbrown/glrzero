var State = require("./State.js");

function Grammar(terminals, rules) {
    this.terminals = [];
    this.rules = {};
    this.unresolvedStates = [];
    this.stateOptions = {};
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
    firstPass : function(rule,ruleLabel) {
        // want to output the rule's states, one for each option
        // and remember where to insert other rules' states
        // rule is an array of options
        for(var i = 0, rlen = rule.length, option, j, s, ls, rs=[];
            i < rlen; i++) {
            option = rule[i];
            // option is an array of terminals and rule names
            // want to go through them in reverse order
            j = option.length;
            ls = [];
            while(j--) {
                s = new State(option[j]);
                if(ls[0] && ls[0].dummy) {
                    this.unresolvedStates.push([ls[0],s]);
                }
                s.addStates(ls);
                ls = [s];
                if(!this.isTerminal(option[j]) && option[j] !== "") {
                    // remember to put in the correct states later
                    s.dummy = true;
                }
            }
            rs = State.merge(rs,ls);
        }
        this.stateOptions[ruleLabel] = rs;
        return rs;
    },
    build : function(startSymbol) {
        var ret, start = new State("",startSymbol);
        // each rule needs to have it's first pass
        Object.keys(this.rules).forEach(function(ruleLabel){
            this.firstPass(this.rules[ruleLabel],ruleLabel);
        }, this);
        start.addStates(this.buildTraverse(startSymbol));
        return start;
    },

    buildTraverse : function(startSymbol,rP,endStates) {
        var rP = rP || {},
            endStates = endStates || [],
            rule = this.stateOptions[startSymbol],
            retState = new State("",startSymbol),
            ls = [];
        rP[startSymbol] = retState;
        rule.forEach(function(state){
            // go through states
            var self = this,blankable = false;
            function processState(state,lastState,li) {
                if(state.dummy) {
                    lastState.states.splice(li,1);
                    if(typeof rP[state.terminal] === "undefined") {
                        lastState.addStates(self.buildTraverse(
                            state.terminal,
                            rP,
                            state.states
                        ));
                    }
                    else {
                        if(state.terminal === startSymbol) {
                            ls.push(lastState);
                        }
                        else
                        lastState.addStates(rP[state.terminal].states);
                    }
                }
                else {
                    if(state.terminal === "") {
                        blankable = true;
                    }
                    else if(state.states.length === 0) {
                        state.states = endStates;
                    }
                    else {
                        state.states.forEach(function(s,i) {
                            processState(s,state,i);
                        },this);
                    }
                }
            }
            processState(state);
            if(blankable) {
                retState.addStates(endStates)
            }
            else retState.addStates([state]);
        },this);
        ls.forEach(function(s){
            s.addStates(rP[startSymbol].states);
        });
        return retState.states;
    }


}
module.exports = Grammar;
