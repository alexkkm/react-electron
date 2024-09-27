
import { Link } from "react-router-dom";
import "./Network.css";

const NetworkPage = () => {
    return (
        <div className="networkPage">
            <p>Network</p>
            <hr />
            <Link to="/">Home</Link>
            <hr />
            <Link to="/firebase">Firebase</Link>
        </div>
    );
};

export default NetworkPage;
