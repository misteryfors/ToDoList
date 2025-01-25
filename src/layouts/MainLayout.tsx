import React from 'react';
import {Header} from "../components/Header/Header.tsx";
import styles from './MainLayout.module.scss'

interface MainLayoutProps {
    children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    return (
      <div className={styles['content']}>
        <Header/>
        <main className={styles['main']}>{children}</main>
      </div>
    );
};


export default MainLayout;
