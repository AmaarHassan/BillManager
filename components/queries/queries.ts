import  gql  from 'graphql-tag';
import { graphql } from 'react-apollo';
import {  Mutation } from 'react-apollo';

const getBillsQuery = gql`
    {
        bills{
            id,
            title,
            status,
            updatedAt,
            createdAt,
            site,
            assets,
            month,
            unitRate,
            unitsConsumed
        }
    }
    `;

// const addBillMutation = gql`
//     mutation($title: String!, $site: String!, $month: String!, $unitRate: Float, $unitsConsumed: Float){
//         createBill(title: $title, site: $site, month: $month, unitRate: $unitRate, unitsConsumed:$unitsConsumed){
//             title
//             id
//         }
//     }
// `;

const addBillMutation = gql`
  mutation addBill($title: String, $site: String, $month: String, $unitRate: Float, $unitsConsumed: Float ) {
    createBill(data: { title: $title, site: $site, month: $month, unitRate: $unitRate, unitsConsumed: $unitsConsumed }) {
      id
      title
    }
  }
`;

// const addBillMutation = gql`
//     mutation(
//         $title: String!, 
//         $site: String!, 
//         $month: String!, 
//         $unitRate: Float,
//         $unitsConsumed: Float,
//         $assets: Json){
//         addBill(title: $title, site: $site, month: $month, unitRate: $unitRate, unitsConsumed:$unitsConsumed, assets:$assets){
//             title
//             id
//         }
//     }
// `;

// //gql import: for creating query
// const getBooksQuery = gql`
// {
//     books{
//         name
//         id
//     }
// }
// `;
// // get single book
// const getBookDetailsQuery = gql`
// query($id: ID){
//     book(id: $id){
//         name
//         id
//         genre
//         author{
//             id
//             name
//             age
//             books{
//                 name
//                 id
//             }
//         }
//     }
// }
// `;
// // make query variables that take in parameters passed to this function
// // ! mark tells that these values are not supposed to be empty


export { getBillsQuery, addBillMutation }