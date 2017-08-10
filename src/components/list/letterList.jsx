import React from 'react'
import classNames from 'classnames'

export default class LetterList extends React.Component{
    constructor(props){
        super(props);
        this.state={
            letterSelect:'热',
            letterShow:false
        }
    }
    handleTouch(){
        //右侧滑动
        var self=this;
        var {letters,onChange}=this.props;
        var lettersLen=letters.length;
        var lastIndex=0;
        var rightCont = this.refs.rightCont;
        var rightContHeight=rightCont.clientHeight;
        var letterShow = this.refs.letterShow;
        var letterItems=rightCont.querySelectorAll('.letter-item');
        var rightContTop=rightCont.getBoundingClientRect().top;
        var letterHeight=letterItems[0].clientHeight;
        rightCont.addEventListener("touchstart", function () {
            self.setState({
                letterShow:true
            });
            changeLetter(e.targetTouches[0].clientY);
        },false);

        rightCont.addEventListener("touchmove", function () {
            // window.requestAnimationFrame(() => {
            changeLetter(e.targetTouches[0].clientY);
            // });
        },false);

        rightCont.addEventListener("touchend", function () {
            setTimeout(function(){
                self.setState({
                    letterShow:false
                });
            },600)
        },false);

        function changeLetter(clientY) {
            clientY=clientY-rightContTop;
            var curIndex=Math.floor(clientY/letterHeight);
            var percent=clientY/rightContHeight;
            if(curIndex < 0 || curIndex >= lettersLen)return;
            if(lastIndex==curIndex)return;
            var letter=letters[curIndex];
            letterShow.innerHTML=letter;
            letterItems[lastIndex].classList.remove('active');
            letterItems[curIndex].classList.add('active');
            lastIndex=curIndex;
            onChange && onChange(letter,percent);
        }
    }
    componentDidMount(){
        this.handleTouch();
    }
    render(){
        const {className,letters,curLetterIndex,onChange, ...other}=this.props;
        const {letterSelect,letterShow}=this.state;
        const cls=classNames({
            'letter-list':true,
            [className]:className
        });
        const letterCls=classNames({
            'letter-select':true,
            [`show`]:letterShow
        });
        return(
            <div className={cls} {...other}>
                <div className="right-cont">
                    <div className="right-cont-inner" ref="rightCont">
                        {
                            letters && letters.length ? letters.map((item,index)=>{
                                return (
                                    <div key={index} className={index==curLetterIndex ? "letter-item active" : "letter-item"} data-value={item}>{item}</div>
                                )
                            }) : ''
                        }
                    </div>
                </div>
                <div className={letterCls} ref="letterShow">
                    {letterSelect}
                </div>
            </div>
        )
    }
}
LetterList.defaultProps={
    curLetterIndex:0,
    letters:["热","A", "B", "C", "D", "E", "F", "G", "H", "J", "K", "L", "M", "N", "P", "Q", "R", "S", "T", "W", "X", "Y", "Z"]
};