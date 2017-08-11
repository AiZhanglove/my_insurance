import React, { Component } from 'react';
const TabPane = props => {
    return (
        <div className={props.className}>
            {props.children}
        </div>
    );
};
export default TabPane;
