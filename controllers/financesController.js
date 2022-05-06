import dayjs from "dayjs";

import db from "../db.js";
import operationSchema from "../schemas/operationSchema.js";

export async function getAllFinances(req, res){
    
}

export async function saveNewOperation(req, res) {
    const body = req.body;
    const {authorization} = req.headers;
    const token = authorization.replace('Bearer', '').trim();
    const operationValidated = operationSchema.validate(body);

    if (operationValidated.error) {
        return res.status(422).send("1 ou mais dados estão incorretos");
    }

    try {
        const {id} = await db.collection("session").findOne({token: token});
        const operation = { 
            id, 
            ...operationValidated.value, 
            date: dayjs(Date.now()).format("DD/MM")
        };

        await db.collection("finances").insertOne({...operation});

        return res.sendStatus(201);
    } catch (e) {
        console.log("Erro ao salvar nova operacao", e);
        res.status(500).send("Erro ao salvar nova operacao");
    }
}