import React from 'react';
export default class Loading extends React.Component {
    shouldComponentUpdate(nextProps) {
        return (nextProps.isLoading !== this.props.isLoading || nextProps.transparent !== this.props.transparent);
    }
    render() {
        var self = this;
        try{
            if(self.props.isLoading){
                if(self.props.transparent){
                    MiFiJsInternal.startLoading(false);
                }else{
                    MiFiJsInternal.startLoading(true);
                }
            }else{
                MiFiJsInternal.stopLoading();
            }
            return (<i></i>);
        }catch (ex){
            var loadingStyle = {
                display: self.props.isLoading ? 'block' : 'none',
                backgroundColor: self.props.transparent ? "transparent" : "#fff"
            }
            return (
                <div className="ins-loading" style={loadingStyle}>
                    <div className="animate"></div>
                </div>
            );
        }
    }
}