import request from 'supertest'
import app from '../server'

describe('Drivers module', () => {
    it('Should return a 400 Bad Request', async () => {
        const response = await request(app).get('/drivers')
        expect(response.statusCode).toEqual(400)
    })

    it('Should return a list of drivers', async () => {
        const response = await request(app)
            .get('/drivers')
            .query({
                latitude: 1.285194,
                longitude: 103.8522982,
                count: 10
            })

        expect(response.statusCode).toEqual(200)
        expect(response.body.drivers.length).toBeGreaterThan(0)
    })

    it('Should return a specific number of drivers', async () => {
        const response = await request(app)
            .get('/drivers')
            .query({
                latitude: 1.285194,
                longitude: 103.8522982,
                count: 5
            })

        expect(response.statusCode).toEqual(200)
        expect(response.body.drivers.length).toEqual(5)
    })
})