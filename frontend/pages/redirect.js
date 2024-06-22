import axios from "axios";

try {
    const res = await axios.get(`/api/auth/google/callback${location.search}`)
    console.log(res); //=> { jwt, user: { username: string, … } }
    
  /*
    Now set the jwt in localStorage or Cookies, once you have finished setting
    data, redirect the user to your logged page
  */
  
  } catch (err) {
    console.error(err)
  }