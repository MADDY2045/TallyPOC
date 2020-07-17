import React,{useEffect,useState } from 'react';

const GsApp = (props) => {

    useEffect(() => {
        if(props.trandata[1]!=undefined){
            console.log('props are',props.trandata[1]);
        }
       }, [props.trandata[1]])

    return (
        <div>
            GS App
        </div>
    );
}

export default GsApp;
