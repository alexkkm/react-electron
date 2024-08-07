import { useState } from 'react';

// react-icons
import { RxCross2 } from "react-icons/rx";
import { MdSettings } from "react-icons/md";
import { BsBroadcastPin } from "react-icons/bs";

import "./NavigationBar.css"

// Navigation Bar
const NavigationBar = () => {
    return (
        <div className='navigationBar'>
            <div className="closeNavigationBarButton">
                <RxCross2 />
            </div>
            <NavigationBarWidget className="setting" icon={<MdSettings style={{ color: '#00f0ff' }} />} title="setting" />
            <NavigationBarWidget className="" icon={<BsBroadcastPin style={{ color: '#00f0ff' }} />} title="network" />
        </div>
    );
};

// The single Navigation Widget
const NavigationBarWidget = ({ icon, title }) => {
    return (
        <div className="navigationBarWidget">
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