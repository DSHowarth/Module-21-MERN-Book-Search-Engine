const User = require('../models/User');
const { signToken } = require('./utils/auth');

const resolvers = {
    Query: {
        me: async () => {
            return User.findOne({_id: pro})
        }
    },

    Mutation: {

    }
}