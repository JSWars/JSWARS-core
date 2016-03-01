
function ParserUtils(){

}

ParserUtils.prototype.ParserUtils=function(array1,array2){

	var acum=0;
	for(var i=0;i<array1.length;i+=1){
		acum+=Math.pow(array1[i]-array2[i],2);
	}

	return Math.sqrt(acum);
};

ParserUtils.prototype.getEstado=function(array, centroides){
	var distanciaTemporal=80000000;
	var centroideAsignado=0;

	for(var i=0;i<centroides.length;i+=1){
		var distance=getDistance(array,centroides[i]);

		if(distance<distanciaTemporal){
			centroideAsignado=i;
			distanciaTemporal=distance;
		}
	}
	return centroideAsignado;
};
