import {ToDo, ToDoState} from '../../../../StorageReducer';

const createNewCard = (listName: keyof ToDoState): { list: keyof ToDoState; item: ToDo } => ({
  list: listName,
  item: {
    id: Date.now().toString(),
    tag: 'low priority',
    text: 'New Task',
    date: new Date().toISOString(),
  },
});

export default createNewCard;
