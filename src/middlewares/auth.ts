import { Request, Response, NextFunction } from "express"
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';


dotenv.config();


export const Auth = {
    private: (req: Request, res: Response, next: NextFunction) => {
        if(req.headers.authorization){
            const [authType, token] = req.headers.authorization?.split(' ')
            if(authType === "Bearer"){
                try{
                    const decoded = jwt.verify(
                        token, 
                        process.env.JWT_KEY as string
                    );
                    
                    next();
                }
                catch(err: any){
                    return res.status(400).json({error: "Token Mal formatted"});
                }
            }
            else{
                return res.status(403).json({error: "Not allowed"});
            }
        }
        else{
            return res.status(400).send({error: "No token received"})
        }
    }
}