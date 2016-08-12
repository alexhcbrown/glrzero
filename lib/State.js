var StateCount = 0;

function union_arrays (x, y) {
    var obj = {};
    for (var i = x.length-1; i >= 0; -- i)
       obj[x[i]] = x[i];
    for (var i = y.length-1; i >= 0; -- i)
       obj[y[i]] = y[i];
    var res = []
    for (var k in obj) {
        res.push(obj[k]);
    }
    return res;
}

function State(terminal,label) {
		this.terminal = terminal;
		this.states = [];
    this.label = label || StateCount++;
}

State.merge = function(retops, ops) {
		if(typeof retops === "undefined") {
    		retops = [];
    }
    ops.forEach(function(op){
    		st = retops.find(function(rop) {
        		return rop.terminal === op.terminal;
        });
        if(typeof st !== "undefined") {
        		st = State.merge(st.states, op.states);
        }
        else {
        		retops.push(op);
        }
    });
    return retops;
}

State.addToEnd = function(targets,insert) {
    for(var i=0,l=targets.length; i<l; i++) {
        if(targets[i].states.length === 0) {
            targets[i].states = insert;
        }
        else {
            State.addToEnd(targets[i].states,insert);
        }
    }
}

State.prototype = {
	addStates : function(states,copy) {
        if(copy) {
            var newStates = [];
            states.forEach(function(s){
                newStates.push(s.deepCopy());
            });
            states = newStates;
        }
		this.states = State.merge(this.states, states);
    },
    deepCopy : function(oL) {
        var s = new State(this.terminal),
            oldLabels = oL || {};
        s.dummy = this.dummy;
        for(var i=0,l=this.states.length;i<l;i++) {
            if(typeof oldLabels[this.states[i].label] === "undefined") {
                oldLabels[this.states[i].label] = true;
                s.states.push(this.states[i].deepCopy(oldLabels));
            }
        }
        return s;
    }
}

module.exports = State;
