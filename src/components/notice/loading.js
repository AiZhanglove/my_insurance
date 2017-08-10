import React from 'react'
import ReactDom from 'react-dom';
import './notice.less'
let loadingExist = false;
let loadingContainer=null;
const Loading=(props)=>{
    return (
        <div className="animate"></div>
    );
}
Loading.show=function (transparent=true) {
    try{
        MiFiJsInternal.startLoading(!transparent);
    }catch (ex){
        if(!loadingExist){
            loadingContainer = document.createElement('div');
            loadingContainer.setAttribute('class','ins-loading');
            loadingContainer.style.display='block';
            loadingContainer.style.backgroundColor=transparent ? 'transparent' : '#fff';
            document.body.appendChild(loadingContainer);
            ReactDom.render(<Loading />, loadingContainer);
            loadingExist=true;
        }
        loadingContainer.style.display='block';
        loadingContainer.style.backgroundColor=transparent ? 'transparent' : '#fff';
    }
};
Loading.hide=function () {
    try{
        MiFiJsInternal.stopLoading();
    }catch (ex){
        loadingContainer.style.display='none';
    }
};
Loading.destroy=function () {
    document.body.removeChild(loadingContainer);
};
export default Loading;