/*
    version: 1.0
    author: Fosztó Zsolt
*/

class Schema {

    #types = {
        "string": "",
        "number": 0,
        "boolean": false,
        "array": [],
        "object": {},
        "undefined": undefined,
        "null": null,
        "function": function(){},
        "date": new Date()
    }

    #primitives = ["string", "number", "boolean", "undefined", "function"]

    constructor(schema){
        this.schema = schema;
        this.value = this.create(this.schema);
    }

    create(schema){
        const result = 
            Array.isArray(schema) ? [] : 
            schema instanceof Object && typeof schema != "function" ? {} : undefined;

        for (const key in schema){
            if (schema[key] instanceof Object && typeof schema[key] != "function" ){
                if (schema[key].constructor.name == "Object" || schema[key].constructor.name == "Array")
                    result[key] = this.create(schema[key]);
                else 
                    result[key] = this.#types[schema[key]];
            }
            else
                result[key] = this.#types[schema[key]];
        }

        return result;
    }

    addIsSet(data){
        this.value =  this.#assign(this.value, data);
        return this.value;
    }

    #assign(ref, data){
        for (const key in ref)
            if (data[key]){
                if (data[key] instanceof Object && typeof data[key] != "function" ){
                    if (data[key].constructor.name == "Object" || data[key].constructor.name == "Array")
                        ref[key] = this.#assign(ref[key], data[key]);
                    else ref[key] = this.compareType(data[key], ref[key]) ? data[key] : undefined;
                }
                else 
                    ref[key] = this.compareType(data[key], ref[key]) ? data[key] : undefined;
            }

        return ref;
    }

    isPrimitive(variable){
        if (this.#primitives.includes(typeof variable))
            return true;
        if (variable == null)
            return true;
        if (typeof variable == "object" && variable.constructor)
            if (this.#primitives.includes(variable.constructor.name.toLowerCase()))
                return true;

        return false;
    }
/**
*    Visszaadja a egy változó típusát, bármilyen is legyen az. csupa kisbetűvel.
*    A javascript önmagában, ha mondjuk egy promitív típust objectként hozok létre, akkkor azt
*    object típusként adja vissza.
*    pl:
*    let s = new String()
*    ennek a tipusa "object" lesz a "typeof" szerint. Míg a Schema szerint ez is "string"
*/
    typeOf(variable){
        if (this.#primitives.includes(typeof variable))
            return typeof variable;
        if (variable == null)
            return "null";
        if (typeof variable == "object" && variable.constructor)
            return variable.constructor.name.toLowerCase();
        
        return "invalid";

    }

    compareType(a, b){
        return this.typeOf(a) === this.typeOf(b);
    }

}
