import React,{ useState,useEffect } from 'react';
import axios from 'axios';

const Tally = (props) => {

    const [contentLoader,setContentLoader] = useState(false);

useEffect(() => {
        // console.log('props changed in GS APP!!',props.vouchertype);
        if(props.vouchertype!=='Choose...' && props.vouchertype!=='' && props.vouchertype!==null){
            setContentLoader(props.loader);
        }else{
            setContentLoader(false);
        }
    }, [props]);


    return (
        <div>
            { contentLoader ? <div className="row">
                <div className="col-md-11 card" style = {{minHeight:'700px',position:"relative",left:"20px"}}>
                    Tally App
                </div>
            </div>:null}

        </div>
    );
}

export default Tally;
