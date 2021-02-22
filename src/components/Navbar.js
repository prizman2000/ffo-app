import React from 'react';
import {NavLink} from 'react-router-dom';

export const Navbar = () => (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
            <NavLink className='navbar-brand' to='/' exact>
                <a className="navbar-brand" >Главная</a>
            </NavLink>
            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <NavLink className='nav-link' to='/orders'>
                            Заявки
                        </NavLink>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
);