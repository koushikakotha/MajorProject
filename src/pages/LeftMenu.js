// LeftMenu.js
import React from 'react';
import { Link } from 'react-router-dom';

const LeftMenu = ({ menus }) => {
  return (
    <div className='sidebar'>
      
      <ul>
        {menus.map((menu) => (
          <li key={menu.path}>
            <Link to={menu.path}>{menu.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LeftMenu;
