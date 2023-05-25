import React from 'react';
import { Link } from 'react-router-dom';

import carRentalContainerCSS from '../../css/container.module.css';
import adminContainerCSS from '../adminCss/adminContainer.module.css';

const AdminAllUsers = () => {
  return (
    <div className={carRentalContainerCSS.carRentalPageContainer}>
      <div className={adminContainerCSS.adminContainer}>
        <p>Users</p>
      </div>
    </div>
  )
}

export default AdminAllUsers