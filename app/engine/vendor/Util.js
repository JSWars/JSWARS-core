"use strict";

var Util={};

/**
 * Checks if the object is instance of the type gived by parameter
 * @param _object
 * @param _type
 */
Util.isInstance=function(_object,_type){
    if (!_object instanceof _type){
        throw "El parámetro 'map' debe ser un objeto válido 'Angle'.";
    }
};


module.exports=Util;