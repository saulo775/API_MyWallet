import express from 'express';
import cors from 'cors';
import chalk from 'chalk';
import "dotenv/config";

import { MongoClient } from 'mongodb';


import { 
    registerUsers, 
    verifyUserIsValidAndLogin,
    logoutUser,
} from './controllers/loginController.js';

import { 
    deleteOperation,
    getAllFinances,
    saveNewOperation,
    updateOperation,
} from './controllers/financesController.js';

const mongoClient = new MongoClient(process.env.MONGO_URI);
const app = express();

app.use(express.json());
app.use(cors());

app.post("/sign-up", registerUsers);
app.post("/sign-in", verifyUserIsValidAndLogin);
app.post("/logout", logoutUser);

app.get("/", getAllFinances);
app.delete("/", deleteOperation);
app.post("/new-operation", saveNewOperation);
app.patch("/", updateOperation);

app.listen(process.env.PORT, () => {
    console.log("Server running on port " + process.env.PORT);
});

