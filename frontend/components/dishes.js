import {useRouter} from "next/router"
import {gql,useQuery} from '@apollo/client';
import {useState, useContext} from 'react'
import AppContext from "./context"
import {
  Button,
  Card,
  CardBody,
  CardImg,
  CardText,
  CardTitle,
  Row,
  Col} from "reactstrap";
function Dishes({restId, search}){
  const [restaurantID, setRestaurantID] = useState()
  const {addItem, user} = useContext(AppContext)

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";

  const GET_RESTAURANT_DISHES = gql`
    query($id: ID!) {
      restaurant(id: $id) {
        data {
          id
          attributes {
            name
            dishes {
              data {
                id
                attributes {
                  name
                  description
                  price
                  image {
                    data {
                      id
                      attributes {
                        url
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const router = useRouter();

  const { loading, error, data } = useQuery(GET_RESTAURANT_DISHES, {
    variables: { id: restId},
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>ERROR here</p>;
  if (!data) return <p>Not found</p>;

  let restaurant = data.restaurant.data;

  if (restId > 0){
    return (
      <>
          {restaurant.attributes.dishes.data
            .filter((dish) => {
              return dish.attributes.name.toLowerCase().includes(search)}
            )
            .map((res) => (
            <Col xs="6" sm="4" style={{ padding: 0 }} key={res.id}>
              <Card style={{ margin: "0 10px" }}>
                <CardImg
                  top={true}
                  style={{ height: 150, width:150 }}
                  src={`${API_URL}${res.attributes.image.data.attributes.url}`}
                />
                <CardBody>
                  <CardTitle>{res.attributes.name}</CardTitle>
                  <CardText>{res.attributes.description}</CardText>
                </CardBody>
                <div className="card-footer">
                  <Button color="info"
                    outline 
                    onClick = {()=> {
                        console.log("add item : ", res)
                        addItem(res)
                    }}
                  >
                    + Add To Cart
                  </Button>
                  
                </div>
              </Card>
            </Col>
          ))}
        </>
        )}
        else{
          return <h1> No Dishes</h1>
        }
    }
    export default Dishes