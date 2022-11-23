import { Router, Request, Response } from 'express';
import * as AuthController from './controller/auth.controller'


const router = Router();


router.get('/ping',(req: Request, res:Response) => {
    res.status(200).send({msg: "pong"});
});


router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.get('/users', AuthController.listUsers);



export default router;