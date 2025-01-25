import React, { useState, forwardRef } from 'react';
import { useDispatch } from 'react-redux';
import { useDrag } from 'react-dnd';
import {deleteToDo, updateToDo, ToDo, ToDoState, moveToAnotherList, moveInList} from '../../../../StorageReducer';
import styles from './Item.module.scss';
import { ReactComponent as ArrowUp} from '../../../../assets/arrow-up-s-fill.svg'
import { ReactComponent as ArrowDown} from '../../../../assets/arrow-down-s-fill.svg'
import { ReactComponent as ArrowLeft} from '../../../../assets/arrow-left-s-fill.svg'
import { ReactComponent as ArrowRight} from '../../../../assets/arrow-right-s-fill.svg'
import { ReactComponent as DeleteBtn} from '../../../../assets/delete-bin-line.svg'
import { ReactComponent as EditeBtn} from '../../../../assets/edit-2-line.svg'
import { ReactComponent as DateIcon} from '../../../../assets/calendar_today.svg'
import { ReactComponent as TimeIcon} from '../../../../assets/schedule.svg'

interface ItemProps {
  item: ToDo;
  listName: keyof ToDoState;
}

const tagClass = {
  "low priority": "low-priority",
  "medium priority": "medium-priority",
  "high priority": "high-priority",
  "highest priority": "highest-priority",
};

const Item = forwardRef<HTMLLIElement, ItemProps>(({ item, listName }, externalRef) => {
  const [edit, setEdit] = useState(false);
  const [editTag, setEditTag] = useState(item.tag);
  const [editText, setEditText] = useState(item.text);
  const [editDate, setEditDate] = useState(item.date.slice(0, 16));

  const dispatch = useDispatch();

  const updateItem = () => {
    const newItem: ToDo = {
      id: item.id,
      tag: editTag,
      text: editText,
      date: editDate,
    };
    dispatch(updateToDo({ id: item.id, item: newItem }));
    setEdit(false);
  };

  const deleteItem = () => {
    dispatch(deleteToDo({ id: item.id }));
  };

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'ITEM',
    item: { id: item.id, listName: listName },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  // Объединение `drag` и внешнего `ref`
  const combinedRef = (el: HTMLLIElement | null) => {
    drag(el);
    if (typeof externalRef === 'function') {
      externalRef(el);
    } else if (externalRef) {
      (externalRef as React.MutableRefObject<HTMLLIElement | null>).current = el;
    }
  };

  const dateTimeClass = new Date(item.date).getTime() <= Date.now()
    ? styles['item__date-time--overdue']
    : styles['item__date-time--not-overdue'];

  const moveItemInList = (direction: 'up' | 'down') => {
    dispatch(moveInList({ list: listName, id: item.id, direction }));
  };

  const moveItemToAnotherList = (direction: 'left' | 'right') => {
    const listOrder: (keyof ToDoState)[] = ['toDo', 'inProgress', 'completed'];

    const currentListIndex = listOrder.indexOf(listName);
    let targetListIndex: number;
    if (direction === 'left') {
      targetListIndex = currentListIndex === 0 ? listOrder.length - 1 : currentListIndex - 1;
    } else { // direction === 'right'
      targetListIndex = currentListIndex === listOrder.length - 1 ? 0 : currentListIndex + 1;
    }
    const targetList = listOrder[targetListIndex];

    dispatch(moveToAnotherList({
      fromList: listName,
      toList: targetList,
      id: item.id,
      targetIndex: 0,
    }));
  };






  return (
    <li
      ref={combinedRef}
      className={`${styles.item} ${isDragging ? styles['item--dragging'] : ''}`}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      {edit ? (
        <>
          <select
            className={styles['item__tag']}
            value={editTag}
            onChange={(event) => setEditTag(event.target.value)}
          >
            <option value="low priority">low priority</option>
            <option value="medium priority">medium priority</option>
            <option value="high priority">high priority</option>
            <option value="highest priority">highest priority</option>
          </select>
          <input
            className={styles['item__text']}
            value={editText}
            onChange={(event) => setEditText(event.target.value)}
            role="textbox"
          />
          <input
            type="datetime-local"
            className={styles['item__date-time']}
            value={editDate}
            onChange={(event) => setEditDate(event.target.value)}
          />
          <button className={styles['item__save']} onClick={updateItem} aria-label="сохранить">
            Сохранить
          </button>
        </>
      ) : (
        <>
          <p className={styles[`item__tag--${tagClass[item.tag as keyof typeof tagClass]}`]}>
            {item.tag}
          </p>
          <p className={styles['item__text']}>{item.text}</p>
          <p
            className={`${styles['item__date-time']} ${dateTimeClass}`}
          >
            <span className={styles['item__date']}>
              <DateIcon/>
              {new Date(item.date).toLocaleDateString('ru-RU', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
            {new Date(item.date).toLocaleTimeString('ru-RU', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
            }) !== '00:00' && (
              <span className={styles['item__time']}>
                <TimeIcon/>
                {new Date(item.date).toLocaleTimeString('ru-RU', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false,
                })}
              </span>
            )}
          </p>
          <button className={styles['item__edit']} onClick={() => setEdit(true)} aria-label="редактировать"><EditeBtn/></button>
          <button className={styles['item__delete']} onClick={deleteItem} aria-label="удалить"><DeleteBtn/></button>
          <>
            <button className={styles['item__btn--top']} onClick={() => moveItemInList('up')} aria-label="вверх"><ArrowUp/></button>
            <button className={styles['item__btn--down']} onClick={() => moveItemInList('down')} aria-label="вниз"><ArrowDown/></button>
            {listName !== 'toDo' && <button className={styles['item__btn--left']} onClick={() => moveItemToAnotherList('left')} aria-label="влево"><ArrowLeft/></button>}
            {listName !== 'completed' && <button className={styles['item__btn--right']} onClick={() => moveItemToAnotherList('right')} aria-label="вправо"><ArrowRight/></button>}
          </>


        </>
      )}
    </li>
  );
});

Item.displayName = 'Item';

export default Item;
