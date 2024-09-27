import "./TutorialPage.css"

import Table from "./Table"
import MessageBoard from "./MessageBoard"
import Button from "./Button"

const TutorialPage = () => {

    return (
        <div className="tutorialPage">
            <p style={{ fontSize: "30px", textAlign: "center" }}>Tutorial Page</p>
            <hr />
            <div>
                <p>Table</p>
                <Table />
            </div>
            <hr />
            <div>
                <p>Message Board</p>
                <MessageBoard />
            </div >
            <hr />
            <div style={{ position: "relative", top: "5px", left: "10px" }}>
                <p>Button</p>
                <Button label={"Testing"} onClick={console.log("test")} />
                <br />
                <br />
            </div >

            <hr />
        </div>
    )
}

export default TutorialPage;