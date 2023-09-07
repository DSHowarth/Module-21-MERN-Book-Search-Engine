const User = require('../models/User');
const { signToken, AuthenticationError } = require('../utils/auth');

const resolvers = {
    // our R operator
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
                // return user, and more importantly for this site, their list of books
                const myProfile = await User.findOne({ _id: context.user._id })
                return myProfile;
            }
        }
    },
    // our CUD operators
    Mutation: {
        login: async (parent, { email, password }) => {
            // try to find user from input
            const userData = await User.findOne({ email });
            
            // confirm user exists
            if(!userData) {
                throw AuthenticationError;
            }

            // use User virtual to confirm password is correct
            const pwCheck = await userData.isCorrectPassword(password);
            if (!pwCheck) {
                throw AuthenticationError;
            }

            // create token for session, return to front end
            const token = signToken(userData);
            return { token, userData };
        },

        // AKA signup
        addUser:  async (parent, {username, email, password}) => {
            // create new user
            const newUser = await User.create({username, email, password});
            // signing up also includes logging in, so we create a token for their session
            const token = signToken(newUser);

            return {token, newUser};
        },
        // add a new book to the user's list of saved books
        saveBook:  async (parent, args, context) => {
            if (context.user) {
                const user = await User.findOne({_id: context.user._id});
                user.savedBooks.push(args.input);
                await user.save();

                return user;
            }

            throw AuthenticationError;
        },
        // removes a book from a user's list of saved books
        removeBook:  async (parent, {bookId}, context) => {
            if (context.user) {
                const user = await User.findOne({_id: context.user._id});
                // find index of book in question, remove it
                const bookIndex = user.savedBooks.map( (book) => book.bookId).indexOf(bookId);
                user.savedBooks.splice(bookIndex, 1);
                await user.save();

                return user;
            }

            throw AuthenticationError;
        }
    }
}


module.exports = resolvers;
