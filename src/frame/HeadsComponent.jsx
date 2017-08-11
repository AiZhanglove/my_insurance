import React from 'react';
import ActivityBar from '../components/ActivityBar.jsx';

const HeadsComponent = props =>{
	return(
		<div>
			<div className="ins-banner">
                {props.fixeds &&
                    <img
                        src={props.fixeds.headUrl}
                        width="100%"
                        className="front-img"
                        alt=""
                    />}
                <ActivityBar id={props.id} />
            </div>
            {props.intro &&
                <div className="ins-infomation btm-bl">
                    <span>
                        {props.intro.intro}
                    </span>
                    <div className="ins-orange">
                        <strong>
                            {props.intro.upperCase}
                        </strong>
                        <span className="sup">
                            {props.intro.lowerCase}
                        </span>
                    </div>
                </div>}
		</div>
	)
};

export default HeadsComponent;