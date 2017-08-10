import React from 'react';
export default class Cover extends React.Component {
    render() {
        var coverimg={
            position: "absolute",
            width:"87%",
            height:"76%",
            left: "6%",
            top:"10%",
            zIndex:1,
            textAlign: "center",
            background:"url(/images/insurance/insurance_bg.png) no-repeat center center",
            backgroundSize:"contain"
        }
        return (
            <a href="/insurance/insurance.html?tintColor=15ADAE&source=p1#/product" style={coverimg}></a>
        );
    }
}