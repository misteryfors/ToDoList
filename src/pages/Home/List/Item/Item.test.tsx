import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { expect } from 'vitest';
import List from '../List.tsx'; // Путь к вашему компоненту List
import store from '../../../../Store.ts'; // Путь к вашему редьюсеру
import '@testing-library/jest-dom';
import { ToDoState, updateLists } from '../../../../StorageReducer.ts';

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
        <List listName={listName} list={[item1]} />
      </DndProvider>
    </Provider>
  );
};

describe('Компонент List', () => {
  it('Корректно рендерит задачу', () => {
    setup('toDo');
    expect(screen.getByText('Test task')).toBeInTheDocument();

    const updatedState = store.getState();
    const taskExists = updatedState.ToDoStorage.toDo.some((task) => task.text === 'Test task');
    expect(taskExists).toBe(true);
  });

  it('Открывает режим редактирования задачи', () => {
    setup('toDo');
    fireEvent.click(screen.getByRole('button', { name: /редактировать/i }));
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /сохранить/i })).toBeInTheDocument();
  });

  it('Сохраняет обновленную задачу', () => {
    setup('toDo');
    fireEvent.click(screen.getByRole('button', { name: /редактировать/i }));
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Updated task' } });
    fireEvent.click(screen.getByRole('button', { name: /сохранить/i }));

    const updatedState = store.getState();
    const updatedTask = updatedState.ToDoStorage.toDo.find((task) => task.id === '1');
    expect(updatedTask?.text).toBe('Updated task');
  });

  it('Удаляет задачу', () => {
    setup('toDo');
    fireEvent.click(screen.getByRole('button', { name: /удалить/i }));

    const updatedState = store.getState();
    const taskExists = updatedState.ToDoStorage.toDo.some((task) => task.id === '1');
    expect(taskExists).toBe(false);
  });

  it('Не показывает кнопку перемещения влево для списка "toDo"', () => {
    setup('toDo');

    // Проверяем, что кнопка "влево" отсутствует
    expect(screen.queryByRole('button', { name: /влево/i })).not.toBeInTheDocument();

    // Проверяем, что кнопка "вправо" присутствует
    expect(screen.getByRole('button', { name: /вправо/i })).toBeInTheDocument();
  });

  it('Не показывает кнопку перемещения вправо для списка "completed"', () => {
    setup('completed');

    // Проверяем, что кнопка "вправо" отсутствует
    expect(screen.queryByRole('button', { name: /вправо/i })).not.toBeInTheDocument();

    // Проверяем, что кнопка "влево" присутствует
    expect(screen.getByRole('button', { name: /влево/i })).toBeInTheDocument();
  });

  it('Показывает обе кнопки перемещения для списка "inProgress"', () => {
    setup('inProgress');

    // Проверяем, что обе кнопки присутствуют
    expect(screen.getByRole('button', { name: /влево/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /вправо/i })).toBeInTheDocument();
  });

  it('Перемещает задачу влево из списка "inProgress" в список "toDo"', () => {
    setup('inProgress');

    store.dispatch(
      updateLists({
        toDo: [],
        inProgress: [item1],
        completed: [],
      })
    );

    // Нажимаем на кнопку "влево"
    fireEvent.click(screen.getByRole('button', { name: /влево/i }));

    const updatedState = store.getState();
    // Проверяем, что задача была удалена из списка "inProgress"
    expect(updatedState.ToDoStorage.inProgress.some((task) => task.id === item1.id)).toBe(false);
    // Проверяем, что задача была добавлена в список "toDo"
    expect(updatedState.ToDoStorage.toDo.some((task) => task.id === item1.id)).toBe(true);
  });

  it('Перемещает задачу вправо из списка "inProgress" в список "completed"', () => {
    setup('inProgress');

    store.dispatch(
      updateLists({
        toDo: [],
        inProgress: [item1],
        completed: [],
      })
    );


    // Нажимаем на кнопку "вправо"
    fireEvent.click(screen.getByRole('button', { name: /вправо/i }));

    const updatedState = store.getState();
    // Проверяем, что задача была удалена из списка "inProgress"
    expect(updatedState.ToDoStorage.inProgress.some((task) => task.id === item1.id)).toBe(false);
    // Проверяем, что задача была добавлена в список "completed"
    expect(updatedState.ToDoStorage.completed.some((task) => task.id === item1.id)).toBe(true);
  });
  it('Перемещает задачу вверх в списке "toDo"', () => {
    setup('toDo');

    // Сначала добавляем несколько задач, чтобы можно было перемещать
    store.dispatch(
      updateLists({
        toDo: [item2, item1],
        inProgress: [],
        completed: [],
      })
    );

    // Нажимаем на кнопку "вверх"
    fireEvent.click(screen.getByRole('button', { name: /вверх/i }));

    const updatedState = store.getState();
    // Проверяем, что задача была перемещена вверх в списке "toDo"
    const toDoList = updatedState.ToDoStorage.toDo;
    expect(toDoList[0].id).toBe('1'); // Первая задача должна быть с id "1"
    expect(toDoList[1].id).toBe('2'); // Вторая задача должна быть с id "2"
  });

  it('Перемещает задачу вверх в списке "inProgress"', () => {
    setup('inProgress');

    // Добавляем несколько задач в список "inProgress"
    store.dispatch(
      updateLists({
        toDo: [],
        inProgress: [item2, item1],
        completed: [],
      })
    );

    // Нажимаем на кнопку "вверх"
    fireEvent.click(screen.getByRole('button', { name: /вверх/i }));

    const updatedState = store.getState();
    // Проверяем, что задача была перемещена вверх в списке "inProgress"
    const inProgressList = updatedState.ToDoStorage.inProgress;
    expect(inProgressList[0].id).toBe('1'); // Первая задача должна быть с id "1"
    expect(inProgressList[1].id).toBe('2'); // Вторая задача должна быть с id "2"
  });

  it('Перемещает задачу вверх, находясь в начале в списке "inProgress"', () => {
    setup('inProgress');

    // Добавляем несколько задач в список "inProgress"
    store.dispatch(
      updateLists({
        toDo: [],
        inProgress: [item1, item2],
        completed: [],
      })
    );

    // Нажимаем на кнопку "вверх"
    fireEvent.click(screen.getByRole('button', { name: /вверх/i }));

    const updatedState = store.getState();
    // Проверяем, что задача была перемещена вверх в списке "inProgress"
    const inProgressList = updatedState.ToDoStorage.inProgress;
    expect(inProgressList[0].id).toBe('1'); // Первая задача должна быть с id "1"
    expect(inProgressList[1].id).toBe('2'); // Вторая задача должна быть с id "2"
  });

  it('Перемещает задачу вниз в списке "toDo"', () => {
    setup('toDo');

    // Сначала добавляем несколько задач, чтобы можно было перемещать
    store.dispatch(
      updateLists({
        toDo: [item2, item1],
        inProgress: [],
        completed: [],
      })
    );

    // Нажимаем на кнопку "вниз"
    fireEvent.click(screen.getByRole('button', { name: /вниз/i }));

    const updatedState = store.getState();
    // Проверяем, что задача была перемещена вверх в списке "toDo"
    const toDoList = updatedState.ToDoStorage.toDo;
    expect(toDoList[0].id).toBe('2'); // Первая задача должна быть с id "1"
    expect(toDoList[1].id).toBe('1'); // Вторая задача должна быть с id "2"
  });

  it('Перемещает задачу вниз в списке "inProgress"', () => {
    setup('inProgress');

    // Добавляем несколько задач в список "inProgress"
    store.dispatch(
      updateLists({
        toDo: [],
        inProgress: [item1, item2],
        completed: [],
      })
    );

    // Нажимаем на кнопку "вниз"
    fireEvent.click(screen.getByRole('button', { name: /вниз/i }));

    const updatedState = store.getState();
    // Проверяем, что задача была перемещена вниз в списке "inProgress"
    const inProgressList = updatedState.ToDoStorage.inProgress;
    expect(inProgressList[0].id).toBe('2'); // Первая задача должна быть с id "1"
    expect(inProgressList[1].id).toBe('1'); // Вторая задача должна быть с id "2"
  });

  it('Перемещает задачу вниз, находясь в конце в списке "inProgress"', () => {
    setup('inProgress');

    // Добавляем несколько задач в список "inProgress"
    store.dispatch(
      updateLists({
        toDo: [],
        inProgress: [item2, item1],
        completed: [],
      })
    );

    // Нажимаем на кнопку "вниз"
    fireEvent.click(screen.getByRole('button', { name: /вниз/i }));

    const updatedState = store.getState();
    // Проверяем, что задача была перемещена вниз в списке "inProgress"
    const inProgressList = updatedState.ToDoStorage.inProgress;
    expect(inProgressList[0].id).toBe('2'); // Первая задача должна быть с id "1"
    expect(inProgressList[1].id).toBe('1'); // Вторая задача должна быть с id "2"
  });
});
