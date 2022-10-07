module.exports = (sequelize, Sequelize) => {
	const News = sequelize.define("news", {
		id_news: {
			type: Sequelize.INTEGER,
			autoIncrement: true,
			primaryKey: true
		  },
		title: {
			type: Sequelize.STRING
		},
		image: {
			type: Sequelize.STRING
		},
		news_content: {
			type: Sequelize.STRING(2500)
		},	
		dlt: {
			type: Sequelize.BOOLEAN,
			defaultValue: false
		},	
	});

	return News;
};