import React,{ useState,useEffect } from 'react';
import axios from 'axios';
import dateformat from 'dateformat'
    // const username = '2ecc6220-e7a1-4dc4-9928-4a78b990e407';
    // const password = '4667110b-67a1-4b98-a3dd-7045ac56c796';
    // const token = Buffer.from(`${username}:${password}`, 'utf8').toString('base64')

    const url = 'http://localhost:6050/sendmessage';
    const url2 = 'http://localhost:6050/getdetails';

const Home = () => {

    const [mobile,setMobile] = useState('9894948839');
    const [karixMobile,setKarixMobile]=useState('');
    const [text,setText]=useState('');
    const [loaderFlag,setLoaderFlag]=useState(false);
    const [mainResponse,setMainResponse]=useState([]);
    const [callUid,setCallUid] = useState([])

    const handleSubmit = (evt) => {
        evt.preventDefault();
        setKarixMobile(`+91${mobile}`)
    }

    const handleDetails=()=>{
            axios.get(url2).then(response=>{
                console.log('details response',response.data);
            }).catch(err=>console.log(err));
    }

    useEffect(()=>{

        if(karixMobile!==''){
            let data = {
                "channel": "whatsapp",
                "source": "+13253077759",
                "destination": [
                `${karixMobile}`
                ],
                "content": {
                "text": `${text}`

            },
            "events_url": "http://4ff9712ba35a.ngrok.io/geteventcallback"
                }
                axios({url,method:'POST',data:data})
                .then(response=>{
                    // console.log(response.data);
                    setMainResponse(response.data);
                }).catch(err=>console.log(err));
            }

          },[karixMobile,text]);


    useEffect(()=>{
        let tempArray = []
        if(mainResponse.length!==0){
            setLoaderFlag(true)
            console.log('main',mainResponse);
            tempArray.push(mainResponse["meta"]["request_uuid"]);
            setCallUid(tempArray)
        }
       },[mainResponse])

useEffect(()=>{
if(callUid!=='' && callUid.length > 0){
   console.log('call uid array is',callUid);
}
},[callUid])

    return (
        <div className="card" style={{minHeight:'600px',maxWidth:'70%',position:"relative",top:"80px",left:"300px"}}>
            <div className="row">
                <div className="col-md-5">
                <div className="form-group">
                <label style={{position:"relative",left:"40px",top:"40px"}}>Mobile: </label>

                <input
                style={{width:'40%',position:"absolute",left:"40px",top:"70px"}}
                    className="form-control"
                    type="text"
                    value={mobile}
                    onChange={e => setMobile(e.target.value)}
                    />
                    <label style={{position:"relative",left:"-10px",top:"140px"}}>Text: </label>

                    <input
                    style={{width:'40%',position:"absolute",left:"40px",top:"170px"}}
                        className="form-control"
                        type="text"
                        value={text}
                        onChange={e => setText(e.target.value)}
                        />
                    <button
                    style={{position:"absolute",top:"400px"}}
                    className="btn btn-primary" onClick={handleSubmit}>Submit</button>
                     <button
                    style={{position:"absolute",top:"400px",left:"200px"}}
                    className="btn btn-warning" onClick={handleDetails}>Get Details</button>
                </div>
            </div>

            { loaderFlag ?
            <div className="col-md-7" style={{overflow:"auto",position:"relative",top:"90px",left:"-100px"}}>
            <div className="table-responsive">
            <table className="table table-striped table-bordered table-success">
            <thead >
                <tr >
                <th scope="col">Uid</th>
                <th scope="col">Message</th>
                <th scope="col">To</th>
                <th scope="col">Status</th>
                <th scope="col">Whatsappfee</th>
                <th scope="col">Platform fee</th>
                <th scope="col">Sent On</th>
                <th scope="col">Total Cost</th>
                <th scope="col">Balance Credits</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                <td>{mainResponse["meta"]["request_uuid"]}</td>
                <td>{mainResponse["objects"][0]["content"]["text"]}</td>
                <td>{mainResponse["objects"][0]["destination"]}</td>
                <td>{mainResponse["objects"][0]["status"]}</td>
                <td>{mainResponse["objects"][0]["channel_details"]["whatsapp"]["whatsapp_fee"]}</td>
                <td>{mainResponse["objects"][0]["channel_details"]["whatsapp"]["platform_fee"]}</td>
            <td>{dateformat(mainResponse["objects"][0]["created_time"],"dd/mm/yyyy")}</td>
                <td>{mainResponse["objects"][0]["total_cost"]}</td>
                <td>{mainResponse["meta"]["available_credits"]}</td>
                </tr>
               </tbody>
        </table>
            </div>

        </div>
            :null}
            {/* end */}
            </div>


        </div>
    );
}

export default Home;
