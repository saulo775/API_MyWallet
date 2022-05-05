import express from 'express';
import cors from 'cors';
import chalk from 'chalk';
import { MongoClient } from 'mongodb';
import "dotenv/config";
import joi from 'joi';


const app = express();
const SERVIDOR_PORT = process.env.PORT || 5500;

app.use(express.json());
app.use(cors());

let database = null;
const mongoClient = new MongoClient(process.env.DB_HOST);
const promise = mongoClient.connect();
promise.then(() => {
    database = mongoClient.db(process.env.DB_NAME);
    console.log(chalk.bold.yellow("Conectado ao banco!!!"));
});
promise.catch((e) => {
    console.log("Problema ao conectar ao banco de dados", e);
});

app.post("/sign_up", async (req, res)=>{
    const body = req.body;
    const userSquema = joi.object({
        username: joi.string().alphanum().min(3).max(30).required(),
        email: joi.string().email().required(),
        password: joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
        password_confirmation: joi.ref('password')
    });

    const userValidated = userSquema.validate(body, {abortEarly: false});

    if (userValidated.error) {
        return res.sendStatus(422);
    }

    const user = {...userValidated.value}
    
    try{
        const oldUser = await database.collection('users').findOne(
            {$or: [{username: user.username},{email: user.email}]}
        );
        if (oldUser) {
            return res.sendStatus(409);
        }
        await database.collection('users').insertOne({...user});
        res.sendStatus(201);
    }catch(e){
        console.log("Erro ao cadastrar", e);
        res.sendStatus(500);
    }
});

app.get("/users", async (req, res)=>{
    const users = database.collection("users").find().toArray();
    console.log(users);
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

