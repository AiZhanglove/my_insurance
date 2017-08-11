import React from 'react';
import './qa.less';
const FaqComponent = props => {
    return (
        <div className="ins-faq__box">
            <h3 className="ins-producttt">常见问题</h3>
            <ul>
                {props.lists.map(function(el, index) {
                    return (
                        <li key={index}>
                            <div className="q">
                                Q：{el.name}
                            </div>
                            <div className="a ins-gray">
                                <span>A：</span>
                                <span
                                    dangerouslySetInnerHTML={{
                                        __html: props.formatHtml(el.content)
                                    }}
                                />
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};
export default FaqComponent;
