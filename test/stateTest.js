var chai = require("chai"),
    assert = chai.assert;
var state = require("../lib/State");


describe("State",function(){
    it("should start empty", function(){
        var start = new state("","S");
        assert.equal(start.states.length,0);
    });
});
