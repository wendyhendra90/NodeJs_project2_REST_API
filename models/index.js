const { Sequelize, DataTypes } = require('sequelize');
// driver sqlite
//const sequelize = new Sequelize('sqlite::memory:');

// sql server
const sequelize = new Sequelize('NodeDB', 'admin', 'admin', {
	dialect: 'mssql',
	dialectOptions: {
	  // Observe the need for this nested `options` field for MSSQL
	  options: {
		// Your tedious options here
		useUTC: false,
		dateFirst: 1,
	  },
	},
  });

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.newss = require('./news')(sequelize, Sequelize);
db.user1s = require('./user1')(sequelize, Sequelize);
db.comments = require('./comment')(sequelize, Sequelize);

db.newss.hasMany(db.comments, {foreignKey: 'id_news', as : "comments"});
db.comments.belongsTo(db.newss, {foreignKey: 'id_news', as:'news'});

module.exports = db;