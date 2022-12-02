import { Request, Response } from "express";
import { PrismaClient} from "@prisma/client";
import bcrypt, { hash } from 'bcrypt';
import dotenv from 'dotenv';
import authConfig from '../config/auth.json';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
dotenv.config();


prisma.$use(async (params:any, next:any) => {

    if( params.model === "User" && params.action === "create" ) {
        const hashedPassword = await hash(params.args.data.password, 10);
        params.args.data.password = hashedPassword;
    }
    const result = await next(params)

    return result
});


function generateToken(userObject: object){
    return jwt.sign(
        userObject, 
        process.env.JWT_KEY as string, 
        {expiresIn: 3600}
    );
}


export const register = async (req:Request, res:Response) => {
    try{
        if(req.body.email && req.body.password){
            let {email, password} = req.body;

            if(await prisma.user.findUnique({where:{email: email}})){
                return res.status(400).send({error: "User already exists"});
            }
            else{
                const user = await prisma.user.create({
                    data: {
                        email: email,
                        password: password,
                    }
                });
                user.password = '*****';
                const token = generateToken(user);
                return res.status(201).send({user, token});
            }
        }else{
            return res.status(400).send({error: "Any data hasn't been received"})
        }
    }
    catch(err: any){
        res.status(400).send({error: "Register failed"});
    }
}


export const login = async (req:Request, res:Response) => {
    try{
        if(req.body.email && req.body.password){
            let {email, password} = req.body;

            const user = await prisma.user.findUnique({
                where: {
                    email: email
                },
                select:{
                    id: true,
                    email: true,
                    password: true
                }
            });

            if(!user){
                return res.status(400).json({error: "User Not Found"});
            }
            else if(!await bcrypt.compare(password, user.password)){
                return res.status(406).json({error: "Invalid Password"});
            }


            user.password = '*****';

            const token = generateToken(user);


                
            return res.status(200).json({user, token});
        }
        else{
            return res.status(400).send({error: "Any data hasn't been received"});
        }
    }
    catch(err: any){
        res.status(400).send({error: "Login failed"});
    }
}


export const listUsers = async (req:Request, res:Response) => {
    try{
        let usersList = await prisma.user.findMany({
            select:{
                id: false,
                email: true,
                password: false
            }
        });

    
        return res.status(200).json({usersList});
    }
    catch(err:any){
        return res.status(400).send({error: "Users request failed"});
    }
}