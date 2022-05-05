import express from 'express';
import cors from 'cors';
import chalk from 'chalk';
import "dotenv/config";

import { 
    registerUsers, 
    verifyUserIsValid 
} from './controllers/loginController.js';


const app = express();
const SERVIDOR_PORT = process.env.PORT || 5500;

app.use(express.json());
app.use(cors());

app.post("/sign-up", registerUsers);

app.post("/sign-in", verifyUserIsValid);

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

