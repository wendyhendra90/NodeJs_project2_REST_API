module.exports = (sequelize, Sequelize) => {
	const User1 = sequelize.define("user1", {
		id_user: {
			type: Sequelize.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		username: {
			type: Sequelize.STRING
		},
		password: {
			type: Sequelize.STRING
		}
	});

	return User1;
};