import "./MessageBoard.css";

const MessageBoard = (parameters) => {
    return (
        <div className="messageBoard">
            <div className="border">
                <div className="body">
                    <h4 className="title">Example of Message Board</h4>
                    <p className="text">
                        This is the exmaple of message board with some example content
                    </p>
                    <p className="text">
                        The goal is: showcasing a start of a UI kit. If you've played the
                        game, you' might be able to pick-up some similarities with the
                        in-game menus.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default MessageBoard;