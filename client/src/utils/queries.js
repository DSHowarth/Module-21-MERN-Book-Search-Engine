import { gql } from '@apollo/client';

export const GET_ME = gql`
    query myProfile {
        me {
            _id
            username
            email
            bookCount
            savedBooks {
                bookId
                authors
                description
                title
                image
                link
            }
        }
    }
    `