import express from 'express';
import cors from 'cors';
import chalk from 'chalk';

const app = express();
const SERVIDOR_PORT = 5500;

app.use(express.json());
app.use(cors());


app.listen(SERVIDOR_PORT, ()=>{
    console.log(chalk.blue.bold(`Servidor rodando na porta ${SERVIDOR_PORT}`));
})

