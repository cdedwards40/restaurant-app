import {gql,useQuery} from '@apollo/client';
import Dishes from "./dishes"
import {useContext, useState} from 'react';


import AppContext from "./context"
import {
  Button,
  Card,
  CardBody,
  CardImg,
  CardText,
  CardTitle,
  Container,
  Input,
  InputGroup,
  InputGroupAddon,
  Row,
  Col} from "reactstrap";

function RestaurantList(props){
  const[restaurantID, setRestaurantID] = useState(0)
  const {cart } = useContext(AppContext);
  const [state, setState] = useState(cart)
  const [dishQuery, setDishQuery] = useState("");

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";

  const GET_RESTAURANTS = gql`
    query {
      restaurants {
        id
        name
        description
        image {
          url
        }
      }
    }
  `;

const GET_DISHES = gql`
  query {
    dishes {
      id
      name
      description
      image {
        url
      }
    }
  }
`;

  const { loading, error, data } = useQuery(GET_RESTAURANTS)
  if (loading) return <p>Loading...</p>;
  if (error) return <p>ERROR</p>;
  if (!data) return <p>Not found</p>;

let searchQuery = data.restaurants.filter((res) =>{
    return res.name.toLowerCase().includes(props.search)
  })

// let restId = searchQuery[0].id   -- commmented this out to get to work
 
// definet renderer for Dishes
  const renderDishes = (restaurantID, search) => {
    return (<Dishes restId={restaurantID} search={search}> </Dishes>)
  };
if(searchQuery.length > 0){
  const restList = searchQuery.map((res) => (
    <Col xs="6" sm="4" key={res.id}>
      <Card style={{ margin: "0 0.5rem 20px 0.5rem" }}>
        <CardImg
          top={true}
          style={{ height: 200 }}
          src={
          `${API_URL}`+ res.image.url
          }
        />
        <CardBody>
          <CardText>{res.description}</CardText>
        </CardBody>
        <div className="card-footer">
        
        <Button color="info" onClick={()=> setRestaurantID(res.id)}>{res.name}</Button>
         
        </div>
      </Card>
    </Col>
  ))

  return(

    <Container>
    <Row xs='3'>
      {restList}
    </Row>

    <div className="dishSearch">
        <InputGroup >
        <InputGroupAddon addonType="append"> Dish Search </InputGroupAddon>
        <Input
            onChange={(e) =>
            setDishQuery(e.target.value.toLocaleLowerCase())
            }
            value={dishQuery}
        />
        </InputGroup><br></br>
    </div>
  
    <Row xs='3'>
    {renderDishes(restaurantID, dishQuery)}
    </Row>
 
    </Container>
 
  )
} else {
  return <h1> No Restaurants Found</h1>
}
}
   export default RestaurantList