jest.mock('./sql');
const Apis = require('./apis');

describe('API entries', async () => {
    test('have login function', () => {
        const req = {
            on: jest.fn(),
        }
        Apis.login(req)
        expect(req.on).toHaveBeenCalledTimes(2)
    })
})