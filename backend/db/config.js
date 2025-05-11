import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'mysql',
    logging: false,
});


// // WARNING: This deletes all the data, forcefully creates new tables;
//  sequelize.sync({ force: true }) 
//      .then(() => console.log("Database & tables created!"))
//     .catch(err => console.error("Error syncing database:", err));

export default sequelize;

