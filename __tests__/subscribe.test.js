const app = require('../server')
const request = require('supertest')
const connectDB = require('../config/dbjest')
const validation = require('../validator/subscriber/index')
const { addSubscriberData } = require('../controllers/subscriber/subscriber.controller')
const mockRequest = () => {
    const req = {}
    req.body = jest.fn().mockReturnValue(req)
    req.params = jest.fn().mockReturnValue(req)
    return req
  }
  const mockResponse = () => {
    const res = {}
    res.send = jest.fn().mockReturnValue(res)
    res.status = jest.fn().mockReturnValue(res)
    res.json = jest.fn().mockReturnValue(res)
    return res
  }
describe('subscribe api test', ()=>{
    beforeAll(async () => {
      await connectDB
    });
    
    it('should return 200', async ()=>{
        const res = await request(app).post('/v1/subscribe').send({
            email: 'wasrrrr@gmail.com'
        })
        .set('Accept', 'application/json')
        .set('authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Indhc2VlbUB5b3BtYWlsLmNvbSIsInVzZXJJZCI6IjYxNmE4MmQyNzQwZTk5MzY4OTNmZTdiNCIsImlhdCI6MTYzNzY2NzkxMSwiZXhwIjoxNjQwMDg3MTExfQ.sOiVb2KjS_5mfUJSPKi9Iymx4mr8LJb3UElGuZ3999Q')
        .set('timezone', 'Asia/Calcutta')
        .set('Accept-Language', 'hi')
        .expect('Content-Type', /json/)
        jest.spyOn(validation, 'addSubscriberValidation');
    
         expect(res.status).toBe(200)

         let req = mockRequest();
        req.body.email = 'wasrrrr@gmail.com';

        const res2 = mockResponse();
        res2.status = res.status;

        await addSubscriberData(req, res2)
            
         
    })

    // it("catch block", async()=>{
    //    await expect(connectDB).resolves.toThrow('some error').;
    // })
    
})