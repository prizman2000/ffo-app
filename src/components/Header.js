import React from 'react';
import ReactLogo from '../images/logo.svg'

export const Header = () => {
    return (
        <div>
            <div>
                <img src={ReactLogo} alt=''/>
            </div>
            <div className='m-text'>
                Онлайн запись
            </div>
        </div>

    );
}