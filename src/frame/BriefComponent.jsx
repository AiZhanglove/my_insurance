import React from 'react';
const BriefComponent = props => {
    //格式化电话
    if (props.details) {
        var telStr = props.details.claim[0].content;
        telStr = telStr.replace(props.tel, function($1) {
            return '<a class="ins-orange" href="tel:' + $1 + '">' + $1 + '</a>';
        });
        telStr = props.details.claim[0].name + '.' + telStr;
    }
    return (
        <div>
            <div className="ins-tlist1">
                <h3 className="ins-producttt">产品介绍</h3>
                <ul>
                    {props.details.presentation.length > 0 &&
                        props.details.presentation.map(function(el, index) {
                            return (
                                <li key={index}>
                                    <span className="left">
                                        {el.name}
                                    </span>
                                    <span className="right ins-gray">
                                        {el.content}
                                    </span>
                                </li>
                            );
                        })}
                    <li>
                        <span className="ins-gray">
                            {props.fixeds.protectionDetail}
                        </span>
                        {props.details.protection.length > 0 &&
                            props.details.protection.map(function(el, index) {
                                return (
                                    <span key={index}>
                                        {index > 0 ? '、' : ''}
                                        <a
                                            title={el.name}
                                            href={
                                                el.content +
                                                '?mifi_download=true'
                                            }
                                            className="ins-red">
                                            《{el.name}》
                                        </a>
                                    </span>
                                );
                            })}
                    </li>
                </ul>
            </div>
            <div className="ins-tlist1 ins-gray">
                <h3 className="ins-producttt">理赔流程</h3>
                {props.fixeds &&
                    props.fixeds.claimFollowUrl !== '' &&
                    <p className="text-center imgbox">
                        <img
                            style={{ maxWidth: '96%' }}
                            src={props.fixeds.claimFollowUrl}
                            alt=""
                        />
                    </p>}
                <ul>
                    {props.details.claim.length > 0 &&
                        props.details.claim.map(function(el, index) {
                            return index > 0
                                ? <li key={index}>
                                      {el.name + '.' + el.content}
                                  </li>
                                : <li
                                      key={index}
                                      dangerouslySetInnerHTML={{
                                          __html: telStr
                                      }}
                                  />;
                        })}
                </ul>
            </div>
        </div>
    );
};
export default BriefComponent;
