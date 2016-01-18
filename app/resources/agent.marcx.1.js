/**
 * Created by Luiss_000 on 14/01/2016.
 */
function init() {

}


function tick() {
	for (var i = 0; i < me.units.length; i++) {
		var friendUnit = me.units[i];
		var friendUnitPosition = friendUnit.position;
		var minimumDistanceEnemy = undefined;
		var selectedEnemy = undefined;
		for (var o = 0; o < enemy.units.length; o++) {
			var enemyUnit = enemy.units[o];
			if (!enemyUnit.alive) {
				continue;
			}
			var enemyUnitPosition = enemyUnit.position;
			var currentEnemyDistance = friendUnitPosition.subtract(enemyUnitPosition).mag();

			if (selectedEnemy === undefined || (minimumDistanceEnemy > currentEnemyDistance)) {
				minimumDistanceEnemy = currentEnemyDistance;
				selectedEnemy = o;
			}
		}
		Utils.log("SelectedEnemy: " + selectedEnemy);
		var pathToEnemy = game.map.getPath(friendUnitPosition, enemy.units[selectedEnemy].position);
		//Now each unit shots to near enemy
		output.unit(i).addAction("attackTo", enemy.units[selectedEnemy].position);

		var minimumDistanceBullet = undefined;
		var selectedBullet = undefined;
		for (var u = 0; u < game.bullets.length; u++) {
			if(game.bullets[u].teamId==me.id){
				continue;
			}

			var bullet = game.bullets[u];
			var bulletPosition = bullet.position;
			var currentBulletDistance = bulletPosition.subtract(friendUnitPosition).mag();

			if (currentBulletDistance < 2) {
				if (selectedBullet === undefined || ( minimumDistanceBullet > currentBulletDistance)) {
					minimumDistanceBullet = currentBulletDistance;
					selectedBullet = u;
				}
			}
		}
		Utils.log("SelectedBullet: " + selectedEnemy);
		if (selectedBullet !== undefined) {

			var bulletFriendVector = game.bullets[selectedBullet].angle;

			Utils.log(bulletFriendVector);

			var bulletFriendVectorPerperdicular = new Utils.Vector2D(-bulletFriendVector.y, bulletFriendVector.x);

			output.unit(i).addAction("moveTo", friendUnitPosition.add(bulletFriendVectorPerperdicular));
		} else {
			if(enemyUnitPosition.subtract(friendUnitPosition).mag()>3){
				output.unit(i).addAction("moveTo", new Utils.Vector2D(pathToEnemy[1][0] + 0.5 , pathToEnemy[1][1] + 0.5));
			}
		}


	}
}
