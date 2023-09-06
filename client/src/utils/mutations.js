import { gql } from '@apollo/client';

export const LOGIN_USER = gql`

`

export const ADD_USER = gql`
mutation addNewUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      userData {
        _id
        name
      }
    }
  }`

export const SAVE_BOOK = gql``

export const REMOVE_BOOK = gql``