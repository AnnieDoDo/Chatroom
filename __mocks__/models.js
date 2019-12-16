const {Account} = jest.genMockFromModule('../models');

Account.findOne = req => req;
Account.upsert = jest.fn(req => Promise.resolve(req))

module.exports = {
  Account,
}