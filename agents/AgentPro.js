var dirMov;
var dirAttack;
function init(){
	dirMov=0;
	dirAttack=Math.PI;
}
function tick(_input,_output){

	output.unitsActions = [new Action(new Angle(dirMov,false),new Angle(dirAttack,true))];
}
