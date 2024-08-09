
import { Link } from "react-router-dom";
import "./Network.css";

const MessageBoard = (parameters) => {
    return (
        <div class="ss">
            <div class="messageBoard">
                <div class="pad">
                    <div class="pad__body">
                        <h4 class="text-heading3 undefined">{parameters.title}</h4>
                        {parameters.textList.map((text) => {
                            return <p>{text}</p>;
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

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
