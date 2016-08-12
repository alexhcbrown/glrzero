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
        // each rule needs to have it's first pass
        Object.keys(this.rules).forEach(function(ruleLabel){
            this.firstPass(this.rules[ruleLabel],ruleLabel);
        }, this);
        return this.buildTraverse(startSymbol,[]);
    },

    buildTraverse: function(symbol,endStates) {
        var rule = this.stateOptions[symbol],
            retState = new State("",symbol);
        retState.addStates(rule,true);
        console.log(symbol);
        for(var optionIndex = 0, optionCount = rule.length;
            optionIndex < optionCount; optionIndex++) {
            // step through states
            var state = retState.states[optionIndex], self = this;
            function step(state,lastState,stateIndex) {
                console.log(state);
                var statesCopy = state.states.slice();
                var nextStates = state.states.length > 0 ?
                    state.states : endStates;
                if(state.dummy) {
                    console.log(nextStates);
                    debugger;
                    var ruleState = self.buildTraverse(
                        state.terminal,
                        nextStates
                    );
                    lastState.states.splice(stateIndex,1);
                    lastState.addStates(ruleState.states);
                }
                if(state.terminal === "") {
                    lastState.states.splice(stateIndex,1);
                    lastState.addStates(nextStates);
                    state = lastState;
                }
                for(var i=0,l=statesCopy.length; i<l; i++) {
                    step(statesCopy[i],state,i);
                }
                if(state.states.length === 0 && !state.dummy) {
                    state.addStates(endStates);
                }
            }
            step(state,retState,optionIndex);
        }
        return retState;
    }


}
module.exports = Grammar;
