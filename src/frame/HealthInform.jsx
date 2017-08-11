import React from 'react';
const formatHtml = str => {
    return str.replace(/\r|\n/g, '<br>');
};
const HealthInform = props => {
    return (
        <dl className="health-inform">
            {props.title &&
                <dt>
                    {props.title}
                </dt>}
            {props.content &&
                <dd dangerouslySetInnerHTML={{ __html: formatHtml(props.content) }} />}
        </dl>
    );
};
export default HealthInform;
