import { useNavigate } from 'react-router-dom';

// react-icons
import { RxCross2 } from "react-icons/rx";
import { MdSettings } from "react-icons/md";
import { BsBroadcastPin } from "react-icons/bs";
import { FaBook } from "react-icons/fa";

import "./NavigationBar.css"

// Navigation Bar
const NavigationBar = ({ switchNavigationBar }) => {
    // name the useNavigate() hook as "navigate"
    const navigate = useNavigate();

    return (
        <div className='navigationBar'>
            <div className="closeNavigationBarButton" onClick={switchNavigationBar}>
                <RxCross2 />
            </div>
            <NavigationBarWidget
                className="setting"
                icon={<MdSettings style={{ color: '#00f0ff' }} />}
                title="setting"
                onClick={() => { console.log("navigate to setting page") }}
            />
            <NavigationBarWidget
                className="network"
                icon={<BsBroadcastPin style={{ color: '#00f0ff' }} />}
                title="network"
                onClick={() => navigate("/network")}
            />
            <NavigationBarWidget
                className="tutorial"
                icon={<FaBook style={{ color: '#00f0ff' }} />}
                title="tutorial"
                onClick={() => navigate("/tutorial")}
            />
        </div>
    );
};

// The single Navigation Widget
const NavigationBarWidget = ({ icon, title, onClick }) => {
    return (
        <div className="navigationBarWidget" onClick={onClick}>
            <BarWidgetIcon icon={icon} />
            <BarWidgetTitle title={title} />
        </div>
    );
};

const BarWidgetIcon = ({ icon }) => {
    return (
        <div className="barWidgetIcon">
            {icon}
        </div>
    )
}

const BarWidgetTitle = ({ title }) => {
    return (
        <div className="barWidgetTitle">
            <p style={{ color: '#00f0ff' }}>{title}</p>
        </div>
    )
}

export default NavigationBar;