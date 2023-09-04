const User = require('../models/User');
const { signToken, AuthenticationError } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
                return User.findOne({ _id: context.user._id })
            }
        }
    },

    Mutation: {
        login: async (parent, { email, password }) => {
            // try to find user from input
            const userData = await User.findOne({ email });
            
            // confirm user exists
            if(!userData) {
                throw AuthenticationError;
            }

            // use User virtual to confirm password is correct
            const pwCheck = await profile.isCorrectPassword(password);
            if (!pwCheck) {
                throw AuthenticationError;
            }

            // create token for session, return to front end
            const token = signToken(userData);
            return { token, userData };
        },
        addUser:  async (parent, {username, email, password}) => {
            // create new user
            const newUser = await User.create({username, email, password});
            
            // signing up also includes logging in, so we create a token for their session
            const token = signToken(newUser);

            return {token, newUser};
        },
        saveBook:  async (parent, {input}, context) => {
            if (context.user) {
                const user = await User.findOne({_id: context.user._id});

                user.savedBooks.push(input);
                await user.save();

                return user;
            }

            throw AuthenticationError;
        },
        removeBook:  async (parent, {bookId}, context) => {

        }
    }
}