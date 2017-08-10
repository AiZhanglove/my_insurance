import React from 'react'
import classNames from 'classnames'
import {prefix} from '../config.js'
require('../base.less');

/**
 * 表单title组件
 * @param props
 * @returns {XML}
 * @constructor
 */
const ListLabel=(props)=>{
    const {className,children, ...other}=props;
    const cls=classNames({
        [`${prefix}-list-label`]:true,
        [className]:className
    });
    return (
        <div className={cls} {...other}>
            {
                children && children.map((el, index) => {
                    return (
                        <div key={index} className={'ins-cpt-list-label-' + el.className}>{el.content}</div>
                    )
                })
            }
        </div>
    )
};

export default ListLabel;