import { createSlice } from "@reduxjs/toolkit";

export interface ToDo {
  id: string;
  tag: string;
  text: string;
  date: string;
}

export interface ToDoState {
  toDo: ToDo[];
  inProgress: ToDo[];
  completed: ToDo[];
}

const defaultData: ToDoState = {
  toDo: [
    { id: "9", tag: "low priority", text: "Lorem ipsum dolor sit amet.", date: "2025-11-29T00:00+03:00" },
    { id: "10", tag: "medium priority", text: "Lorem ipsum dolor sit amet.", date: "2022-03-29T23:29+03:00" },
    { id: "11", tag: "high priority", text: "Lorem ipsum dolor sit amet.", date: "2023-04-29T00:00+03:00" },
    { id: "12", tag: "highest priority", text: "Lorem ipsum dolor sit amet.", date: "2024-05-29T00:00+03:00" },
  ],
  inProgress: [
    { id: "5", tag: "low priority", text: "Lorem ipsum dolor sit amet.", date: "2021-06-29T00:00+03:00" },
    { id: "6", tag: "medium priority", text: "Lorem ipsum dolor sit amet.", date: "2022-07-29T00:00+03:00" },
    { id: "7", tag: "high priority", text: "Lorem ipsum dolor sit amet.", date: "2023-08-29T00:00+03:00" },
    { id: "8", tag: "highest priority", text: "Lorem ipsum dolor sit amet.", date: "2024-09-29T00:00+03:00" },
  ],
  completed: [
    { id: "1", tag: "low priority", text: "Lorem ipsum dolor sit amet.", date: "2025-10-29T00:00+03:00" },
    { id: "2", tag: "medium priority", text: "Lorem ipsum dolor sit amet.", date: "2026-11-29T00:00+03:00" },
    { id: "3", tag: "high priority", text: "Lorem ipsum dolor sit amet.", date: "2027-12-29T00:00+03:00" },
    { id: "4", tag: "highest priority", text: "Lorem ipsum dolor sit amet.", date: "2028-01-29T00:00+03:00" },
  ],
};

const initialState: ToDoState = (() => {
  const storedData = localStorage.getItem("ToDoData");
  return storedData ? JSON.parse(storedData) : defaultData;
  //return defaultData;
})();

const StorageReducer = createSlice({
  name: "ToDoStorage",
  initialState,
  reducers: {
    updateLists: (state, action: { payload: ToDoState }) => {
      const { toDo, inProgress, completed } = action.payload;
      state.toDo = toDo;
      state.inProgress = inProgress;
      state.completed = completed;
      localStorage.setItem("ToDoData", JSON.stringify(state));
    },
    updateToDo: (state, action: { payload: { id: string, item: ToDo } }) => {
      for (const list in state) {
        const currentList = state[list as keyof ToDoState];
        const index = currentList.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) {
          currentList[index] = action.payload.item;
          break;
        }
      }
      localStorage.setItem("ToDoData", JSON.stringify(state));
    },
    moveToAnotherList: (state, action: { payload: { fromList: keyof ToDoState; toList: keyof ToDoState; id: string, targetIndex: number } }) => {
      const { fromList, toList, id, targetIndex } = action.payload;

      const itemIndex = state[fromList].findIndex(item => item.id === id);
      if (itemIndex !== -1) {
        const item = state[fromList].splice(itemIndex, 1)[0];
        state[toList].splice(targetIndex, 0, item); // Вставляем в нужное место
        localStorage.setItem("ToDoData", JSON.stringify(state)); // Обновление локального хранилища
      }
    },
    moveInList: (state, action: { payload: { list: keyof ToDoState; id: string; direction: 'up' | 'down' } }) => {
      const { list, id, direction } = action.payload;
      const currentList = state[list];
      const index = currentList.findIndex((item) => item.id === id);

      if (index !== -1) {
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex >= 0 && targetIndex < currentList.length) {
          [currentList[index], currentList[targetIndex]] = [currentList[targetIndex], currentList[index]];
          localStorage.setItem("ToDoData", JSON.stringify(state));
        }
      }
    },
    deleteToDo: (state, action: { payload: { id: string } }) => {
      for (const list in state) {
        const currentList = state[list as keyof ToDoState];
        const newList = currentList.filter((item) => item.id !== action.payload.id);
        if (newList.length !== currentList.length) {
          state[list as keyof ToDoState] = newList;
          break;
        }
      }
      localStorage.setItem("ToDoData", JSON.stringify(state));
    },
    addToDo: (state, action: { payload: { list: keyof ToDoState; item: ToDo } }) => {
      const { list, item } = action.payload;
      console.log(list)
      state[list].push(item);
      localStorage.setItem("ToDoData", JSON.stringify(state));
    },
  },
});

export const { updateToDo, updateLists,moveInList, moveToAnotherList, deleteToDo, addToDo } = StorageReducer.actions;
export default StorageReducer.reducer;
