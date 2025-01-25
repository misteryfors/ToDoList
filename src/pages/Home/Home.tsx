import React from 'react';
import styles from './Home.module.css';
import List from "./List/List.tsx";
import { useSelector } from "react-redux";
import { RootState } from "../../Store";
import { ToDoState } from "../../StorageReducer";  // Убедитесь, что этот импорт правильный

const Home: React.FC = () => {
  const storage = useSelector((state: RootState) => state.ToDoStorage);

  return (
    <article className={styles['lists']}>
      {Object.entries(storage).map(([listName, list]) => (
        <List key={listName} listName={listName as keyof ToDoState} list={list} />
      ))}
    </article>
  );
};

export default Home;
