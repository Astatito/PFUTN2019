import firebase from "firebase";

const config = {
    apiKey: "AIzaSyB837_BMh2WnGbXWVoOE0xclKymC7aC2lc",
    authDomain: "countryapp-ab360.firebaseapp.com",
    databaseURL: "https://countryapp-ab360.firebaseio.com",
    projectId: "countryapp-ab360",
    storageBucket: "",
    messagingSenderId: "570428474188",
    appId: "1:570428474188:web:9865d0ea7c0a9e0b"
  }; 

  const fire = firebase.initializeApp(config);
  export default fire;