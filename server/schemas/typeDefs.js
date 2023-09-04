const typeDefs =`
    type User {
        _id: ID
        username: String
        email: String
        bookCount: Number
        savedBooks: [Book]
    }

    type Book {
        bookId: String
        authors: [String]
        description: String
        title: String
        image: String
        link: String
    }

    type Auth {
        token: ID!
        user: User
    }
`