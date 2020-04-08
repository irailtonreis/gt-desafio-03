import { Router } from 'express';
import multer from 'multer';
import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import FileController from './app/controllers/FileController';
import DeliverymanController from './app/controllers/DeliverymanController';
import OrderController from './app/controllers/OrderController';
import ViewController from './app/controllers/ViewController';
import DeliveryProblemController from './app/controllers/DeliveryProblemController';
import StatusController from './app/controllers/StatusController';
import authMiddleware from './app/middlewares/auth';
import multerConfig from './config/multer';

const routes = new Router();

const upload = multer(multerConfig);

routes.post('/sessions', SessionController.store);

routes.get('/view/:id', ViewController.index);
routes.get('/view/:id/deliveries', ViewController.show);
routes.post('/delivery/:id/problems', DeliveryProblemController.store);

routes.put('/status/:id/deliveries', StatusController.update);

routes.use(authMiddleware);
routes.get('/recipients', RecipientController.index);
routes.post('/recipients', RecipientController.store);
routes.put('/recipients/:id', RecipientController.update);
routes.delete('/recipients/:id', RecipientController.delete);

routes.post('/files', upload.single('file'), FileController.store);

routes.get('/deliverymen', DeliverymanController.index);
routes.post('/deliverymen', DeliverymanController.store);
routes.put('/deliverymen/:id', DeliverymanController.update);
routes.delete('/deliverymen/:id', DeliverymanController.delete);

routes.post('/orders', OrderController.store);
routes.get('/orders', OrderController.index);
routes.put('/orders/:id', OrderController.update);
routes.delete('/orders/:id/cancel-delivery', OrderController.delete);

routes.get('/delivery/:id/problems', DeliveryProblemController.index);

export default routes;
