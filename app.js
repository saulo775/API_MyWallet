import express from 'express';
import cors from 'cors';
import chalk from 'chalk';
import { MongoClient } from 'mongodb';

const app = express();
const SERVIDOR_PORT = 5500;

app.use(express.json());
app.use(cors());

let database = null;
const mongoClient = new MongoClient("mongodb://localhost/27017");
const promise = mongoClient.connect();
promise.then(() => {
    database = mongoClient.db("DB_MyWallet");
    console.log(chalk.bold.yellow("Conectado ao banco!!!"));
});
promise.catch((e) => {
    console.log("Problema ao conectar ao banco de dados", e);
});


app.post("/register", async (req, res)=>{
    
});

app.get("/users", async (req, res)=>{
    console.log("Route Consult users");
});

app.post("/login", async (req, res)=>{
    console.log("Login");
});

app.get("/", async (req, res)=>{
    console.log("Home");
});

app.post("/new_operation", async (req, res)=>{
    console.log("Operacao");
});

app.post("/logout", async (req, res)=>{
    console.log("Logout");
});

app.delete("/delete_operation", async (req, res)=>{
    console.log("DELETAR Operacao");
});

app.put("/new_operation", async (req, res)=>{
    console.log("ATUALIZAR Operacao");
});




app.listen(SERVIDOR_PORT, ()=>{
    console.log(chalk.blue.bold(`Servidor rodando na porta ${SERVIDOR_PORT}`));
})

