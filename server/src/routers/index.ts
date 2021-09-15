import { Router } from "express";
import driversRouter from './drivers.router'

const router = Router()

router.use('/drivers', driversRouter)

export default router