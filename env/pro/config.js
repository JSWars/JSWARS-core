var Config;

Config = {
	http: {
		ip: '0.0.0.0',
		port: 8090
	},
	path: '/api',
	apis: {
		github: {
			clientID: 'sampleid',
			clientSecret: 'samplesecret',
			callbackURL: "http://jswars.org/api/login/github/callback"
		}

	},
	db: {
		url: "mongodb://127.0.0.1/tfg"
	}
};

module.exports = Config;

