import React from 'react';
import ReactDOM from 'react-dom/client';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/dashboard.module.css';




export function Dashboard() {
  return (
    <body className={styles.body}>
      <div className={styles.titleContainer}>

        <h1 className={styles.title}>Dashboard</h1>

      </div>

      
    </body>
  );
}

export default Dashboard;