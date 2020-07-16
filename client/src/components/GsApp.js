import React,{ useState,useEffect } from 'react';
import axios from 'axios';
import parseString from 'xml2js';

var xmlstring = '<ENVELOPE><HEADER><TALLYREQUEST>Export Data</TALLYREQUEST></HEADER><BODY><EXPORTDATA><REQUESTDESC><REPORTNAME>Day Book</REPORTNAME><STATICVARIABLES><SVEXPORTFORMAT>$$SysName:XML</SVEXPORTFORMAT><SVCURRENTCOMPANY>Main</SVCURRENTCOMPANY><SVFROMDATE>20190401</SVFROMDATE><SVTODATE>20190401</SVTODATE></STATICVARIABLES></REQUESTDESC></EXPORTDATA></BODY></ENVELOPE>';

const GsApp = (props) => {

    const [contentLoader,setContentLoader] = useState(false);



useEffect(() => {
        // console.log('props changed in GS APP!!',props.vouchertype);
        if(props.vouchertype!=='Choose...' && props.vouchertype!=='' && props.vouchertype!==null){
            if(props.vouchertype==='All'){
                setContentLoader(props.loader);
            }
        }else{
            setContentLoader(false);
        }
    }, [props]);

useEffect(() => {
    console.log('finalgsArray changed!!!',props.finalgsArray);
    }, [props.finalgsArray]);


    return (
        <div>
            { props.loader ? <div className="row">
                <div className="col-md-11 card" style = {{minHeight:'700px',position:"relative",left:"50px"}}>
                    GS App
                </div>
            </div>:null}

        </div>
    );
}

export default GsApp;
