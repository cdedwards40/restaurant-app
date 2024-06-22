/* /lib/auth.js */

import { useEffect } from "react";
import Router from "next/router";
import Cookie from "js-cookie";
import axios from "axios";
// import NextAuth from "next-auth"
// import GoogleProvider from "next-auth/providers/google";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";

// export default NextAuth({
//   // Configure one or more authentication providers
//   providers: [
//       GoogleProvider({
//           // clientId: process.env.GOOGLE_CLIENT_ID as string,
//           // clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
//           clientId: process.env.GOOGLE_CLIENT_ID,
//           clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       }),
//       // GithubProvider({
//       //     clientId: process.env.GITHUB_ID as string,
//       //     clientSecret: process.env.GITHUB_SECRET as string,
//       // }),
//       // ...add more providers here
//   ],
// })

//register a new user
export const registerUser = (username, email, password) => {
  //prevent function from being ran on the server
  if (typeof window === "undefined") {
    return;
  }
  return new Promise((resolve, reject) => {
    axios
      .post(`${API_URL}/auth/local/register`, { username, email, password })
      .then((res) => {
        //set token response from Strapi for server validation
        Cookie.set("token", res.data.jwt);

        //resolve the promise to set loading to false in SignUp form
        resolve(res);
        //redirect back to home page for restaurance selection
        // console.log("in auth getting ready to push")
        // Router.push("/");
        // console.log("done pushing")
      })
      .catch((error) => {
        //reject the promise and pass the error object back to the form
        reject(error);
      });
  });
};

export const login = (identifier, password) => {
  //prevent function from being ran on the server
  if (typeof window === "undefined") {
    return;
  }

  return new Promise((resolve, reject) => {
    axios
      .post(`${API_URL}/auth/local/`, { identifier, password })
      .then((res) => {
        //set token response from Strapi for server validation
        Cookie.set("token", res.data.jwt);

        //resolve the promise to set loading to false in SignUp form
        resolve(res);
        //redirect back to home page for restaurance selection
        Router.push("/");
      })
      .catch((error) => {
        //reject the promise and pass the error object back to the form
        reject(error);
      });
  });
};

export const googleLogin = () => {
  //prevent function from being ran on the server
  if (typeof window === "undefined") {
    return;
  }
  
  return new Promise((resolve, reject) => {
    const h2 = {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': "*"
      }
    };
    console.log('trying to connect to ' + `${API_URL}/connect/google`)
    axios
      .get(`${API_URL}/connect/google`)
      .then((res) => {
        console.log(res)
        console.log(res.data)

        // //set token response from Strapi for server validation
        // Cookie.set("token", res.data.jwt);

        // //resolve the promise to set loading to false in SignUp form
        // resolve(res);
        // //redirect back to home page for restaurance selection
        // Router.push("/");
      })
      .catch((error) => {
        //reject the promise and pass the error object back to the form
        reject(error);
      });
  });
};


export const logout = () => {
  //remove token and user cookie
  Cookie.remove("token");
  delete window.__user;
  // sync logout between multiple windows
  window.localStorage.setItem("logout", Date.now());
  //redirect to the home page
  Router.push("/");
};

//Higher Order Component to wrap our pages and logout simultaneously logged in tabs
// THIS IS NOT USED in the tutorial, only provided if you wanted to implement
export const withAuthSync = (Component) => {
  const Wrapper = (props) => {
    const syncLogout = (event) => {
      if (event.key === "logout") {
        Router.push("/login");
      }
    };

    useEffect(() => {
      window.addEventListener("storage", syncLogout);

      return () => {
        window.removeEventListener("storage", syncLogout);
        window.localStorage.removeItem("logout");
      };
    }, []);

    return <Component {...props} />;
  };

  if (Component.getInitialProps) {
    Wrapper.getInitialProps = Component.getInitialProps;
  }

  return Wrapper;
};
