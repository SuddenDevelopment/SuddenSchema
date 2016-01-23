var assert        = require("assert");
var should        = require("should");
var SuddenSchema   = require("../suddenschema");

/*
## FEATURES:
- Gives all of the keys found, across all objects, recursively
- Gives generic data types per key: number, string, boolean
- Arrays have all of the data types defined within them including obejct definitions, mixed data tpyes included.
- Attempts to identify more specific data types: UnixTime, JSTime, IP, Email, URL, Domain, proper nouns, acronyms, auto incrementing ID
- String Attributes: all caps, 
- Gives cardinality, how many unique values exist (up to a limit) vs count.
- Gives sample values
- If Cardinality < values.length it's vrey useful to use for spliting into groups 
*/

//sample Data
var arrCollection=[
	 {"id":1,"source":"wikipedia","user":"anthony","score":11,"ts":1453503081}
    ,{"id":2,"source":"wikipedia","user":"randall","score":19,"msts":1453503081000}
    ,{"id":3,"source":"twitter","user":"anthony","score":8, "ip":"1.2.3.4"}
    ,{"id":4,"source":"wikipedia","user":"wes","score":33,"email":"anthong@whatevs.net" }
    ,{"id":5,"source":"en","user":"anthony","score":78, "url":"https://github.com/SuddenDevelopment"}
    ,{"id":6,"source":"wikipedia","user":"wes","score":43,"domain":"github.com"}
    ,{"id":7,"source":"twitter","user":"wes","score":56,"par":{"chi":true}}
    ,{"id":8,"source":"wikipedia","user":"randall","score":24,"text":"And then IBM said we can't bother Steven Brown anymore. But we didn't listen."}
    ,{"id":9,"source":"wikipedia","user":"anthony","score":13,"arr":['anthong@whatevs.net',32,1453503081]}
];
var schema = new SuddenSchema();
var objSchema = schema.newSchema(arrCollection);
console.log(objSchema);

//do all the keys exist, including ones found in later objects
describe('test for keys', function () {
 it('should return key count of 13', function (done) {
    //test    
    var intKey = objSchema.keys.length;
    //check
   (intKey).should.be.exactly(13);
   done();
 });
});
//did it find the correct numeric ranges score: 11->56

//did it give the correct strings data source: length=2->9

//did it properly identify specific data types beyond boolean, string, text:

//cardinality test user: 3

//sample values score:

//array tests arr: