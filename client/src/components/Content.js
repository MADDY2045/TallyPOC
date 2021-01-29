import React from 'react'
import CreateNewTemplate from './CreateNewTemplate';
const Content=(props)=>{
    return (
        <div className="bg">
            <CreateNewTemplate userEmail={props.useremail} loggedIn={ props.loggedIn } canShow={props.createNew}/>
        </div>
    )
}

export default Content
