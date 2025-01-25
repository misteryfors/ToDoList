import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import './style/style.scss'
import {Provider} from "react-redux";
import Store from "./Store.ts";
import AppRouter from "./AppRouter.tsx";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={Store}>
      <DndProvider backend={HTML5Backend}>
        <AppRouter/>
      </DndProvider>
    </Provider>
  </StrictMode>,
)
