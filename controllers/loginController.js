import bcrypt from "bcrypt";

import db from '../db.js';
import createUserSchema from "../schemas/createUserSquema.js";
import loginUserSquema from "../schemas/loginUserSquema.js";
import { v4 as uuidV4 } from "uuid";
import { ObjectId } from "mongodb";

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

export async function verifyUserIsValidAndLogin(req, res){
    const loginData = loginUserSquema.validate(req.body, {
        abortEarly: false,
    });

    if (loginData.error) {
        return res.sendStatus(422);
    }

    const userLogin = loginData.value;

    try {
        const userSavedInBD = await db.collection("users").findOne({email: userLogin.email});
        const token = uuidV4();

        if (!userSavedInBD) {
            return res.status(422).send("Email ou senha incorretos!!!");
        }
        const comparePassword = await bcrypt.compare(userLogin.password, userSavedInBD.password);

        if (!comparePassword) {
            return res.status(422).send("Email ou senha incorretos!!!");
        }


        await db.collection('session').insertOne(
            {
                token: token,
                id: new ObjectId(userSavedInBD._id),
            }
        );

        res.status(200).send(token);
    } catch (e) {
        console.log("Impossível buscar usuário no banco", e)
        res.sendStatus(500);
    }
}

export async function logoutUser(req, res) {
    const {authorization} = req.headers;
    const token = authorization.replace('Bearer', '').trim();
    
    try {
        const tokenForDelete = await db.collection('session').findOneAndDelete({token: token});

        if (!tokenForDelete.value) {
            return res.status(422).send("token não encontrado!");
        }
        res.sendStatus(200);
    } catch (e) {
        console.log("Não foi possível fazer o logout!!!",e);
        res.sendStatus(500);
    }
}