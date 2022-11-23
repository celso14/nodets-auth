import express, {Request, Response, ErrorRequestHandler} from 'express';
import path from 'path';
import cors from 'cors';
import apiRoutes from './routes';

const server = express();
const port = 5000;

server.use(cors());

server.use(express.static(path.join(__dirname, '../public')));
server.use(express.json());

server.use(apiRoutes);

server.use((req: Request, res: Response) => {
    res.status(404);
    res.json({ error: 'Endpoint não encontrado.' });
});

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    res.status(400); // Bad Request
    console.log(err);
    res.json({ error: 'Ocorreu algum erro.' });
}
server.use(errorHandler);



//Localhost PORT settings
server.listen(port, () => {
    console.log(`Running on Port ${port}`);
});