import  gql  from 'graphql-tag';

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

const addBillMutation = gql`
  mutation addBill($title: String, $site: String, $month: String, $unitRate: Float, $unitsConsumed: Float, $assets: Json) {
    createBill(data: { title: $title, site: $site, month: $month, unitRate: $unitRate, unitsConsumed: $unitsConsumed, assets: $assets }) {
      id
    }
  }
`;

// // get single bill
// const getillDetailsQuery = gql`
// query($id: ID){
//     bill(id: $id){
//         title
//         id
//         site
//         assets
//      }
// }
// `;

// // make query variables that take in parameters passed to this function
export { getBillsQuery, addBillMutation }