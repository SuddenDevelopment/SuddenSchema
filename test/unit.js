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
describe('test number ranges', function () {
 it('should return range min of 8 for score field', function (done) {
   (objSchema.vals.score.min).should.be.exactly(8);
   done();
 });
});
describe('test number ranges', function () {
 it('should return range max of 56 for score field', function (done) {
   (objSchema.vals.score.max).should.be.exactly(78);
   done();
 });
});


//did it give the correct strings data source: length=2->9
describe('test strings ranges', function () {
 it('should return range min of 2 for score field', function (done) {
   (objSchema.vals.source.min).should.be.exactly(2);
   done();
 });
});
describe('test strings ranges', function () {
 it('should return range max of 9 for score field', function (done) {
   (objSchema.vals.source.max).should.be.exactly(9);
   done();
 });
});

//did it properly identify specific data types beyond boolean, string, text:
describe('test specific data types', function () {
 it('should find email', function (done) {
   (objSchema.vals.email.dataTypes[0]).should.be.exactly('email');
   done();
 });
});


//cardinality test user: 3
describe('test user cardinality', function () {
 it('should return range max of 9 for score field', function (done) {
   (objSchema.vals.source.cardinality).should.be.exactly(3);
   done();
 });
});

//sample values score:

//array tests arr: