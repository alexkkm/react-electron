// the "auth" is used for the functions from package "firebase/auth"
import firebaseTools from "../assets/firebase";
import firebaseImagePath from "../assets/firebase-Icon.png";

import "./Firebase.css";

const NewFirebasePage = () => {
    return (
        <div className="firebasePage">
            <img src={firebaseImagePath} className="firebaseImage" />
            <p>Trying the real firebase page</p>

        </div>
    );
};

export default NewFirebasePage;
