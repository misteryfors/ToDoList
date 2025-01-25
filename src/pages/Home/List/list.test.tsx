import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import List from './List';
import { DndProvider } from 'react-dnd';
import {HTML5Backend} from "react-dnd-html5-backend";
import { ToDoState, updateLists } from '../../../StorageReducer';
import store from "../../../Store.ts";


// Создаем простой store для тестирования
const item1 = {
  id: '1',
  tag: 'low priority',
  text: 'Test task',
  date: new Date().toISOString(),
};
const item2 = {
  id: '2',
  tag: 'low priority',
  text: 'Test task',
  date: new Date().toISOString(),
};
const item3 = {
  id: '3',
  tag: 'low priority',
  text: 'Test task',
  date: new Date().toISOString(),
};

const setup = (listName: keyof ToDoState) => {
  store.dispatch(
    updateLists({
      toDo: [item1],
      inProgress: [item2],
      completed: [item3],
    })
  );

  render(
    <Provider store={store}>
      <DndProvider backend={HTML5Backend}>
      <List listName={listName} list={store.getState().ToDoStorage[listName]} />
      </DndProvider>
    </Provider>
  );
};


it('Добавляет новую задачу в список при клике на кнопку "Добавить карточку"', () => {
  setup('toDo');

  // Нажимаем на кнопку "Добавить карточку"
  fireEvent.click(screen.getByText(/добавить карточку/i));

  const updatedState = store.getState();

  // Проверяем, что в списке "toDo" появилась новая задача
  expect(updatedState.ToDoStorage.toDo.length).toBeGreaterThan(0);
});

