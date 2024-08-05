import { TfiViewList } from "react-icons/tfi";

import "./NavigationBar.css"

// Navigation Bar
const NavigationBar = () => {
    return (
        //TODO Use a json to store for the different Widgets information
        <div className='navigationBar'>
            <NavigationBarWidget />
            <NavigationBarWidget />
        </div>
    );
};

// The single Navigation Widget
const NavigationBarWidget = () => {
    return (
        <div className="navigationBarWidget">
            <BarWidgetIcon />
            <BarWidgetTitle />
        </div>
    );
};

const BarWidgetIcon = () => {
    return (
        <div className="barWidgetIcon">
            <TfiViewList style={{ color: '#00f0ff' }} />
        </div>
    )
}

const BarWidgetTitle = () => {
    return (
        <div className="barWidgetTitle">
            <p style={{ color: '#00f0ff' }}>Title</p>
        </div>
    )
}


export default NavigationBar;