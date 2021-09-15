import axios from "axios";
import { Request, Response, Router } from "express";

const router = Router()

router.get('/', async (req: Request, res: Response) => {
    if (!req.query.latitude || !req.query.longitude) {
        return res.status(400).json({
            error: {
                name: 'BadRequest',
                message: 'Parameter `latitude` and `longitude` is required',
            }
        })
    }

    const { latitude, longitude, count } = req.query

    const { data } = await axios.get('https://qa-interview-test.splytech.dev/api/drivers', {
        params: {
            latitude,
            longitude,
            count,
        }
    })

    return res.json(data)
})

export default router