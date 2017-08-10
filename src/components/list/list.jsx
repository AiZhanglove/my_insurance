import React, { Component } from 'react';
import classNames from 'classnames'
import './index.less';
const List=(props)=>{
    const {className,children,...other}=props;
    const cls=classNames({
        'list':true,
        [className]:className
    })
    return(
        <div className={cls} {...other}>{children}</div>
    )
}
export default List;
