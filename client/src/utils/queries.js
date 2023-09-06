import { gql } from '@apollo/client';

export const GET_ME = gql`
    query myProfile {
        me {
            username
            email
            bookCount
            savedBooks
        }
    }
    `