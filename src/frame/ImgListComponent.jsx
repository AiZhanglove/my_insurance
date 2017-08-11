import React from 'react';
import classNames from 'classnames'
import './ImgList.less';
const ImgListComponent = (props) => {
    const {lists,className} = props;
    let cls = classNames({
        "ins-imglist__box":true,
        [className]:className
    })
    return (
        <div className={cls}>
            {
                lists.length > 0 && lists.map(function (el, index) {
                    return (
                        <div key={index} className="ins-imglist__box__inner" onClick={()=>props.onClick && props.onClick(el)} >
                            <img src={el.content} />
                        </div>
                    )
                })
            }
        </div>
    )
}

export default ImgListComponent;