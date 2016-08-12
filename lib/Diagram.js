var vis = require("vis");

var Diagram = {};

Diagram.buildData = function(state) {
    var labelIndex = {},
        nodes = [],
        edges = [];
    function buildIndex(state) {
        if(typeof labelIndex[state.label] === "undefined") {
            labelIndex[state.label] =
                {id:state.label, label:state.label};
            nodes.push(labelIndex[state.label]);
            for(var i=0,l=state.states.length;i<l;i++) {
                edges.push({from:state.label,to:state.states[i].label,
                            label:state.states[i].terminal,
                            font: {align: 'horizontal'},
                            arrows:'to'});
                buildIndex(state.states[i]);
            }
        }
    }
    buildIndex(state);
    return {
        nodes: nodes,
        edges: edges
    };
}

Diagram.drawFromData = function(nodes,edges,container) {
    var network = new vis.Network(container,
        {nodes:nodes,edges:edges}, {});
    return network;
}

Diagram.drawStateDiagram = function(state,container) {
    // first build nodes variable
    var data = Diagram.buildData(state);
    var network = new vis.Network(container, data, {});
    return network;
}

module.exports = Diagram;
