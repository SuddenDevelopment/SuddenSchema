# SuddenSchema

Determine the ranges and data types for a number of records given samples.

constructs a schema that can be used for json data

## API:
	Create Schema : Given an array of objects, determine all of the keys, data types and ranges
	Update Schema : Given a schema and an array of objects, update the schema with the new objects for range

## FEATURES:
- Gives all of the keys found, across all objects, recursively
- Gives generic data types per key: number, string, boolean
- Arrays have all of the data types defined within them including obejct definitions, mixed data tpyes included.
- Attempts to identify more specific data types: UnixTime, JSTime, IP, Email, URL, Domain, auto incrementing ID
- Gives cardinality, how many unique values exist vs count.
- Gives sample values
- If Cardinality < values.length it's vrey useful to use for spliting into groups 