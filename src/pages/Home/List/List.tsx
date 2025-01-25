import React, { useRef, useEffect } from 'react';
import { useDrop } from 'react-dnd';
import { useDispatch } from 'react-redux';
import { addToDo, moveToAnotherList, ToDoState, ToDo } from '../../../StorageReducer';
import styles from './List.module.scss';
import Item from './Item/Item.tsx';
import Placeholder from './Placeholder/Placeholder.tsx';
import useHoverIndex from './useHoverIndex';
import createNewCard from './utils/createNewCard.ts';

interface ListProps {
  listName: keyof ToDoState;
  list: ToDo[];
}

const List: React.FC<ListProps> = ({ listName, list }) => {
  const dispatch = useDispatch();
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]); // Ссылки на элементы
  const listRef = useRef<HTMLUListElement | null>(null);
  const [hoverIndex, updateHoverIndex, resetHoverIndex] = useHoverIndex(list, itemRefs, listRef);

  const [{ isOver }, drop] = useDrop({
    accept: 'ITEM',
    hover: (_, monitor) => updateHoverIndex(monitor),
    drop: (item: { id: string; listName: keyof ToDoState }) => {
      if (hoverIndex !== null) {
        dispatch(
          moveToAnotherList({
            fromList: item.listName,
            toList: listName,
            id: item.id,
            targetIndex: hoverIndex,
          })
        );
      }
      resetHoverIndex();
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  useEffect(() => {
    if (!isOver) resetHoverIndex();
  }, [isOver]);

  return (
    <section ref={drop} className={styles['list']}>
      <p className={styles['list__name']}>{listName.replace(/([A-Z])/g, ' $1').trim()}</p>
      <ul ref={listRef} className={styles['list__block']}>
        {list.map((item, index) => (
          <React.Fragment key={item.id}>
            {hoverIndex === index && <Placeholder />}
            <Item item={item} listName={listName} ref={(el) => (itemRefs.current[index] = el)} />
          </React.Fragment>
        ))}
        {hoverIndex === list.length && <Placeholder />}
      </ul>
      <div className={styles['list__button-block']}>
        <button className={styles['list__add-button']} onClick={() => dispatch(addToDo(createNewCard(listName)))}>
          Добавить карточку
        </button>
      </div>
    </section>
  );
};

export default List;
