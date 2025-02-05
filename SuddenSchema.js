/*

## FEATURES:
- Gives all of the keys found, across all objects, recursively
- Gives generic data types per key: number, string, boolean
- Arrays have all of the data types defined within them including obejct definitions, mixed data tpyes included.
- Attempts to identify more specific data types: UnixTime, JSTime, IP, Email, URL, Domain, propper nouns, acronyms, auto incrementing ID
- String Attributes: all caps, 
- Gives cardinality, how many unique values exist (up to a limit) vs count.
- Gives sample values
- If Cardinality < values.length it's vrey useful to use for spliting into groups 

- Parse strings https://github.com/loadfive/Knwl.js/

*/

if (typeof window == 'undefined'){var utils = require('suddenutils'); var datatypetester = require('datatypetester');}
var _ = new utils(); var libTypeTester = new datatypetester();
var SuddenSchema = function(objConfig){
	'use strict';
	var modVal = {},newVal={},endVal={},find={};
	var intSampleLimit=100;
	var self=this;
	this.newSchema=function(arrCollection){
		return this.modSchema(arrCollection,{keys:[],vals:{}});
	};

	this.modSchema=function(arrCollection,objSchema){
		if(arrCollection.constructor!==Array){ arrCollection=[arrCollection]; }
		//check for too many in a collection? there should be SOME limit

		//process all of the objects
		_.forEach(arrCollection,function(v,k){
			objSchema=self.addObject(v,objSchema);
		});

		//run any final checks at the end that we didnt want to do every object or periodically
		_.for(objSchema.keys,function(v,k){
			var tmpVal=_.get(objSchema.vals,v);
			//console.log('type: ',tmpVal.typ);
			if(!tmpVal || typeof tmpVal.typ==='undefined' || tmpVal===null){ 
				//console.log(v,'value not found for endCalc',objSchema.keys); 
			}
			else{ _.set(objSchema.vals,v,endVal[tmpVal.typ](tmpVal)); }
		});
		return objSchema;
	};

	this.addObject=function(obj, objSchema){
		if(typeof objSchema === 'undefined'){console.log('no schema given to add to');}
		//update the keys
		var arrKeys = _.deepKeys(obj);
		arrKeys = arrKeys.concat(objSchema.keys);
		objSchema.keys = _.unique(arrKeys);
		objSchema.keys.sort();
		//update the values
		_.for(objSchema.keys,function(v,k){
			var varVal=_.get(obj,v);
			//make sure this object has the key we're looking for 1st
			if(typeof varVal !=='undefined' && varVal!==null){
				if( _.get(objSchema.vals,v)===null ){
					//if it's a compound path, need to create the parent first
					if(_.strCount('.',v)>0){ 
						var arrProperties = v.split('.');
						//using a regular for loop here because the utils, _.for goes backwards, im sure I could reverse first but that defats the purpose of the fast utility loop
						for(var i=0;i<arrProperties.length;i++){
							var strKey=arrProperties.slice(0,i+1).join('.');
							//this is the end property, the rest is lineage to get here
							if(i===arrProperties.length-1){ 
								var tmpVal=newVal[typeof varVal](varVal,{cnt:1});
								_.set(objSchema.vals,v,tmpVal);
							}
							else if(_.get(objSchema.vals,strKey)===null){ 
								//lineage	
								_.set(objSchema.vals,strKey,{});
							}
						}
					}else{
						//create new values object for a key based on var type
						objSchema.vals[v]=newVal[typeof varVal](_.get(obj,v),{cnt:1});
					}
				}
				else{
					//console.log(v,varVal);
					//console.log(_.get(objSchema.vals,v+'cnt')+1);
					_.set(objSchema.vals,v+'.cnt',_.get(objSchema.vals,v+'.cnt')+1);
					_.set(objSchema.vals,v,modVal[typeof varVal](varVal,_.get(objSchema.vals,v)));
				}
			}else{
				//no value found for this object at specified key of v 
				//console.log('couldnt find: ', v);
			}
		});		
		return objSchema;
	};
//----====|| NewValues ||====----\\
	newVal.object=function(val,objVal){
		objVal.typ='object';
		//When this happens it means the object wasnt mapped out for properties to be added to keys yet OR it's an array
		if(val.constructor===Array){
			
		}else{
			//we should never get here because every object has deepkeys run on it and added to the keys in the schema
		}
		return objVal;
	};
	newVal.boolean=function(val,objVal){
		objVal.typ='boolean';
		if( val!=="" && val!==null){ objVal.hasValues=1; }else{ objVal.hasValues=0; }
		objVal.cnt_true=0;
		objVal.cnt_false=0;
		objVal['cnt_'+val]++;
		objVal.dataTypes=['boolean'];
		return objVal;
	};
	newVal.number=function(val,objVal){
		//try to determine if it's a unix timestamp
		objVal.typ='number';
		if( val!=="" && val!==null){ objVal.hasValues=1; }else{ objVal.hasValues=0; }
		objVal.min=val;
		objVal.max=val;		
		objVal.first=val;
		objVal.last=val;
		objVal.dataTypes=[];
		objVal.samples=[val];
		return objVal;
	};
	newVal.string=function(val,objVal){
		var intLength=val.length;
		objVal.typ='string';
		if( val!=="" && val!==null){ objVal.hasValues=1; }else{ objVal.hasValues=0; }
		objVal.min=intLength;
		objVal.max=intLength;
		objVal.samples=[val];
		objVal.dataTypes=[];
		return objVal;
	};
	newVal.function=function(val,objVal){
		//convert the function to a string
		val=val.toString();
		return objVal; 
	};
//----====|| ModValues ||====----\\
	modVal.object=function(val,objVal){
		//When this happens it means the object wasnt mapped out for properties to be added to keys yet OR it's an array
		if(val.constructor===Array){
			
		}else{
			//get the path, add it to the keys, run it bac
		}
		if( val!=="" && val!==null){ objVal.hasValues++; }
		return objVal;
	};
	modVal.boolean=function(val,objVal){
		objVal['cnt_'+val]++;
		if( val!=="" && val!==null){ objVal.hasValues++; }
		return objVal;
	};
	modVal.number=function(val,objVal){
		if(val < objVal.min){ objVal.min=val; }
		if(val > objVal.max){ objVal.max=val; }
		objVal.last=val;
		if( val!=="" && val!==null){ objVal.hasValues++; }
		return objVal;
	};
	modVal.string=function(val,objVal){
		var intLength=val.length;
		if(intLength < objVal.min){ objVal.min=intLength; }
		if(intLength > objVal.max){ objVal.max=intLength; }
		objVal.samples.push(val);
		if(objVal.cnt%intSampleLimit===0){ 
			//time to trim based on multiple of limit, good to do this in batches instead of every iteration
			//find the trim point, in the middle, want to keep the oldest values for reference
			var intStart=Math.floor(intSampleLimit/2);
			objVal.samples.splice(intStart,intSampleLimit);
		}
		if( val!=="" && val!==null){ objVal.hasValues++; }
		return objVal;
	};
	modVal.function=function(objVal){
		
	};
//----====|| FINAL CALCS ||====----\\
	endVal.object=function(objVal){
		//When this happens it means the object wasnt mapped out for properties to be added to keys yet OR it's an array
		return objVal;
	};
	endVal.array=function(objVal){
		return objVal;
	};
	endVal.boolean=function(objVal){
		return objVal;
	};
	endVal.number=function(objVal){
		//test for number only possibilities, unix time, js time, incrementing id
		objVal.dataTypes=libTypeTester.test(objVal.samples);
		return objVal;
	};
	endVal.string=function(objVal){
		objVal.cardinality= _.unique(objVal.samples).length;
		//could be just about anything check for all string and number possibilities within
		//objVal.dataTypes=find.string(_.unique(objVal.samples));
		objVal.dataTypes=libTypeTester.test(_.unique(objVal.samples));
		//console.log(objVal.dataTypes);
		return objVal;
	};
	endVal.function=function(objVal){
		return objVal;
	};
};
if (typeof module !== 'undefined' && module.exports){module.exports = SuddenSchema;}