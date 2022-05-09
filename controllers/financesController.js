import dayjs from "dayjs";
import { ObjectId } from "mongodb";

import db from "../db.js";
import operationSchema from "../schemas/operationSchema.js";
import updateOperationSchema from "../schemas/updateOperationSchema.js";

export async function getAllFinances(req, res){
    const {authorization} = req.headers;
    const token = authorization.replace('Bearer', '').trim();


    try {
        const verifyUserValid = await db.collection("session").findOne({token: token})
        if (!verifyUserValid) {
            return res.status(403).send("Não autorizado");
        }

        const {id} = verifyUserValid;
        const finances = await db.collection("finances").find(
            {id: new ObjectId(id)}
        ).toArray();

        const operations = finances.map((item)=>{
            delete item.id;
            return item;
        })
        res.status(200).send(operations);

    } catch (e) {
        console.log("Não foi possível encontrar as operações!", e);
        res.status(500).send("Não foi possível encontrar as operações!");
    }
}

export async function saveNewOperation(req, res) {
    const body = req.body;
    const Authorization = req.headers['authorization'];
    const token = Authorization.replace("Bearer", '').trim();
    
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

export async function deleteOperation(req, res) {
    const {_id} = req.headers;
    console.log(_id)

    try {
        const operation = await db.collection("finances").deleteOne({_id: new ObjectId(_id)});
        
        if (operation.deletedCount <= 0 ) {
            return res.sendStatus(404);
        }
        return res.sendStatus(202);
    } catch (e) {
        console.log("Não foi possível deletar", e);
        res.status(500).send("Não foi possível deletar", e);
    }
}

export async function updateOperation(req, res) {
    const {_id} = req.headers;
    const body = req.body;

    const updateData = updateOperationSchema.validate(body);
    if (updateData.error) {
        return res.status(422).send("1 ou mais dados estão incorretos");
    }

    try {
        const operationToUpdate = await db.collection("finances").findOneAndUpdate(
            {_id: new ObjectId(_id)},
            {
                $set: {
                    amount: body.amount,
                    description: body.description
                }
            }
        );

        if (!operationToUpdate) {
            return res.sendStatus(422);
        }

        return res.sendStatus(202);
    } catch (e) {
        console.log("Não foi possível atualizar", e);
        res.status(500).send("Não foi possível atualizar");
    }
}