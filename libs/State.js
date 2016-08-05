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

State.prototype = {
		addStates : function(states) {
    		this.states = State.merge(this.states, states);
    },
    subTerminals : function() {
		var terminals = [];
        if(this.terminal !== "") {
          terminals.push(this.terminal);
        }
        this.states.forEach(function(st){
    		if(st.label !== this.label &&
                terminals.indexOf(st.terminal) < 0) {
        		terminals.push(st.terminal);
                terminals = union_arrays(terminals, st.subTerminals());
            }
        });
        return terminals;
    },
    toTableWorker : function(ts) {
		var terminals = ts || this.subTerminals(),
    		rows = [Array(terminals.length+1).fill("-")];
        rows[0][0] = this.label;
        console.log(this.states[0].label,this.label);
        this.states.forEach(function(st){
    		rows[0][terminals.indexOf(st.terminal)+1] = st.label;
            if(st.label !== this.label) {
                rows = rows.concat(st.toTableWorker(terminals));
            }
        });
        return rows;
    },
    toTable : function() {
		var s = "\n",
    		t = this.subTerminals(),
            rs = this.toTableWorker(t),
            tt = t.unshift("s"),
            rrs = {};
        rs.forEach(function(r){
        		rrs[r[0]] = r;
        });
        rs = [];
        for(var r in rrs) rs.unshift(rrs[r]);
        rs.unshift(t);
        rs.forEach(function(r) {
        		s+= r.join(" | ") + "\n";
        });
        return s;
    }
}

module.exports = State;
