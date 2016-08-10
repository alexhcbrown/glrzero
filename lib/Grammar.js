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
                if(!this.isTerminal(option[j])) {
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
        var ret;
        // each rule needs to have it's first pass
        Object.keys(this.rules).forEach(function(ruleLabel){
            this.firstPass(this.rules[ruleLabel],ruleLabel);
        }, this);
        console.log(this.unresolvedStates);
        // now need to go through all the unresolved states and
        // replace them with the other rules' states
        for(var i = 0, ulen = this.unresolvedStates.length, dummy;
            i < ulen; i++) {
            dummy = this.unresolvedStates[i];
            // dummy[0] is the dummy state which stores the states
            // that come after the nested state has been absorped
            // dummy[1] is the state that comes before the dummy
            // each of the state options' last states
            // needs to have the same states as the dummy state
            var newStates = [];
            this.stateOptions[dummy[0].terminal].forEach(function(s){
                newStates.push(s.deepCopy(dummy[0]));
            });
            console.log(newStates);
            State.addToEnd(newStates, dummy[0].states);
            dummy[1].addStates(newStates);
            if(dummy[0].terminal === startSymbol) {

            }
        }
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
            var self = this;
            function processState(state,lastState,li) {
                console.log(state,lastState);
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
                    lastState = state;
                    if(state.states.length === 0) {
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
            retState.addStates([state]);
        },this);
        ls.forEach(function(s){
            s.addStates(rP[startSymbol].states);
        });
        return retState.states;
    }


}
module.exports = Grammar;
