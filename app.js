import express from 'express';
import cors from 'cors';
import chalk from 'chalk';
import "dotenv/config";

import { 
    registerUsers, 
    verifyUserIsValidAndLogin,
    logoutUser,
} from './controllers/loginController.js';

import { 
    deleteOperation,
    getAllFinances,
    saveNewOperation,
} from './controllers/financesController.js';


const app = express();
const SERVIDOR_PORT = process.env.PORT || 5500;

app.use(express.json());
app.use(cors());

app.post("/sign-up", registerUsers);
app.post("/sign-in", verifyUserIsValidAndLogin);
app.post("/logout", logoutUser);
app.get("/", getAllFinances);
app.delete("/", deleteOperation);

app.post("/new-operation", saveNewOperation);


app.put("/new_operation", async (req, res)=>{
    console.log("ATUALIZAR Operacao");
});




app.listen(SERVIDOR_PORT, ()=>{
    console.log(chalk.blue.bold(`Servidor rodando na porta ${SERVIDOR_PORT}`));
})

