import { Router } from 'express';
import { searchTrips } from '../controllers/trip.controller';

const router = Router();

router.get('/', searchTrips);

export default router;