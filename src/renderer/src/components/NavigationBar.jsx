import { useState } from 'react';

import { TfiViewListAlt } from "react-icons/tfi";
import { BsBroadcastPin } from "react-icons/bs";

import "./NavigationBar.css"

// Navigation Bar
const NavigationBar = () => {
    return (
        <div className='navigationBar'>
            <NavigationBarWidget icon={<TfiViewListAlt style={{ color: '#00f0ff' }} />} title="setting" />
            <NavigationBarWidget icon={<BsBroadcastPin style={{ color: '#00f0ff' }} />} title="network" />
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