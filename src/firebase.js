import firebase from 'firebase';

var config = {
  apiKey: "AIzaSyD3GczvOuA_kTdu9s5kCY8TU9vO0HfwIK8",
  authDomain: "egm-app-beta.firebaseapp.com",
  databaseURL: "https://egm-app-beta.firebaseio.com",
  projectId: "egm-app-beta",
  storageBucket: "egm-app-beta.appspot.com",
  messagingSenderId: "89806904863"
};

export default firebase.initializeApp(config);
