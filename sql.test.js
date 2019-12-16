jest.mock('./models');
jest.mock('uuid/v4')

const Sql = require('./sql');
const {Account} = require('./models');

describe('Database operations', () => {
    test('search', () => {
        expect(Sql.search('aaa')).toStrictEqual({
            attributes: ["password"],
            where: {
                accountdata: 'aaa',
            }
        });
    })
    test('newAccount', () => {
        Sql.newAccount('aaa', 'bbb');
        expect(Account.upsert).toHaveBeenCalledWith({
            accountdata: 'aaa',
            admin: 0,
            aid:undefined,
            password: 'bbb'
        })
    })
})