import { Router } from 'express';
import { DataManager } from '@manager/data/data.manager';
import { DataController } from '@controller/data/data.controller';

const router = Router();

// Dependency injection setup
const dataManager = new DataManager();
const dataController = new DataController(dataManager);

// Mount the data controller routes directly
router.use('/', dataController.getRouter());

export default router;
