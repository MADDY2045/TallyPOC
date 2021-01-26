import React from 'react'

const Navbar=(props)=>{

    return (
        <div className="main">
            <nav className="navbar navbar-expand-lg navbar-dark bg-info">
                <ul className="nav navbar-nav navbar-center">
                <li className="nav-item dropdown ">
                    <span className="nav-link text-white"  id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    Menu
                    </span>
                    <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                        <span onClick={props.createNewTemplate} className="dropdown-item" >Create New</span>
                        <span className="dropdown-item" >List All Templates</span>
                        <span className="dropdown-item" >Get Templates by id</span>
                    </div>
                </li>
                </ul>
            </nav>
        </div>
    )
}

export default Navbar;