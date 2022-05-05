import { MongoClient } from 'mongodb';
import chalk from 'chalk';


let db = null;
const mongoClient = new MongoClient(process.env.DB_HOST);

try {
    await mongoClient.connect();
    db = mongoClient.db(process.env.DB_NAME);
    console.log(chalk.bold.yellow("Conectado ao banco!!!"));
} catch (e) {
    console.log("Problema ao conectar ao banco de dados", e);
}

export default db;