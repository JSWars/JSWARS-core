describe("Game Class", function () {
	var Game,
		Team,
		Bullet,
		AgentController;

	beforeEach(function () {
		Game=require("../../app/engine/Game");
		Team=require("../../app/engine/Team");
		Bullet=require("../../app/engine/Bullet");
		AgentController=require("../../app/engine/controllers/AgentController");
	});

	it("should add a team", function () {
		var game = new Game;

		//Empty list of teams
		expect(Object.keys(game.teams).length).toBe(0);

		game.addTeam("Luis", new AgentController("agents/AgentDer.js"));

		//At least 1 team
		expect(Object.keys(game.teams).length).toBe(1);

		//First team name is Luis
		expect(game.teams[0].getName()).toBe('Luis');

	});


	it('should add a bullet', function () {
		 var game = new Game;

		//Empty list of bullets
		expect(game.bullets.length).toBe(0);


		//Moar test......
		//game.addBullet();
	})
});
