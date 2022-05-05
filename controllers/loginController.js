import bcrypt from "bcrypt";

import db from '../db.js';
import createUserSchema from "../schemas/createUserSquema.js";

export async function registerUsers(req, res){
    const body = req.body;
    const userValidated = createUserSchema.validate(body, {abortEarly: false});

    if (userValidated.error) {
        return res.sendStatus(422);
    }

    const user = {...userValidated.value}

    try{
        const oldUser = await db.collection('users').findOne(
            {
                $or: [
                    {username: user.username},
                    {email: user.email}
                ]
            }
        );

        if (oldUser) {
            return res.sendStatus(409);
        }

        const hashedPassword = await bcrypt.hash(user.password, 10);

        await db.collection('users').insertOne(
            {
                username: user.username, 
                email: user.email,
                password: hashedPassword
            }
        );

        res.sendStatus(201);
    }catch(e){
        console.log("Erro ao cadastrar", e);
        res.sendStatus(500);
    }
}