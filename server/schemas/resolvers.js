const User = require('../models/User');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async (parent, {_id}) => {
            return User.findOne({_id: _id})
        }
    },

    Mutation: {

    }
}