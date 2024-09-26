import React, { useState, useContext, useEffect } from "react";
import Cart from "../components/cart"
import {ApolloProvider,ApolloClient,HttpLink, InMemoryCache} from '@apollo/client';
import RestaurantList from '../components/restaurantList';
import { InputGroup, InputGroupAddon,Input} from "reactstrap";
import AppContext from "../components/context";
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import axios from 'axios';

function Home() {
    // const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost/strapi";
    // const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:1337";
    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost/strapi";
    const [restaurantQuery, setRestaurantQuery] = useState("");
    const link = new HttpLink({ uri: `${API_URL}/graphql`})
    const cache = new InMemoryCache()
    const client = new ApolloClient({link,cache});
    const appContext = useContext(AppContext);
    const router = useRouter();
    const { asPath } = router;

    function handleGoogleLogin(params) {
        axios
          .get(`${BACKEND_URL}/api/auth/google/callback?${params}`)
          .then((res) => {
            Cookies.set("token", res.data.jwt);
            appContext.setUser(res.data.user);
          })
          .catch(err => {
            console.log(err)
          })
    }

    useEffect(() => {
      if (asPath.length > 2) {
          try {
            handleGoogleLogin(asPath.slice(2, asPath.length));
            router.replace("/", undefined, { shallow: true })
          } catch {err => {
            console.log('Error parsing query parameters.')
            console.log(err)
          }}
          
      }
    }, [])

    return (
        <ApolloProvider client={client}>
          <div className="search">
              <h2>Local Restaurants</h2>
                <InputGroup >
                <InputGroupAddon addonType="append"> Restaurant Search </InputGroupAddon>
                <Input
                    onChange={(e) =>
                    setRestaurantQuery(e.target.value.toLocaleLowerCase())
                    }
                    value={restaurantQuery}
                />
                </InputGroup><br></br>
            </div>
            <RestaurantList search={restaurantQuery} />
            {console.log(appContext)}
            {appContext.user !== false ? <Cart></Cart> : null}
        </ApolloProvider>
    );
  }
  export default Home;
  
