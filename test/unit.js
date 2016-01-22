var assert        = require("assert");
var should        = require("should");
var SuddenSchema   = require("../suddenschema");

/*
## FEATURES:
- Gives all of the keys found, across all objects, recursively
- Gives generic data types per key: number, string, boolean
- Arrays have all of the data types defined within them including obejct definitions, mixed data tpyes included.
- Attempts to identify more specific data types: UnixTime, JSTime, IP, Email, URL, Domain, auto incrementing ID
- Gives cardinality, how many unique values exist (up to a limit) vs count.
- Gives sample values
- If Cardinality < values.length it's vrey useful to use for spliting into groups 
*/

//sample Data

//do all the keys exist, including ones found in later objects

//did it find the correct numeric ranges

//did it give the correct strings data

//did it properly identifyt specific data types beyond boolean, string

//cardinality test

//sample values

//array tests