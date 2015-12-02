var Config;

Config = {
	http: {
		ip: '0.0.0.0',
		port: 8090
	},
	path: '/api',
	apis: {
		github: {
			clientID: '4fe54540f35eb99dbfa7',
			clientSecret: '40d94397a272430fc8cbcbd73cd5775e926fc59e',
			callbackURL: "http://jswars.org/api/login/github/callback"
		}

	},
	db: {
		url: "mongodb://127.0.0.1/tfg"
	}
};

module.exports = Config;

