import { useState, useRef, useCallback } from 'react';
import { XYCoord, DropTargetMonitor } from 'react-dnd';
import { ToDo } from '../../../StorageReducer';

const useHoverIndex = (
  list: ToDo[],
  itemRefs: React.MutableRefObject<(HTMLLIElement | null)[]>,
  listRef: React.RefObject<HTMLUListElement>
) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const hoverIndexRef = useRef<number | null>(null);

  const updateHoverIndex = useCallback(
    (monitor: DropTargetMonitor) => {
      const offset = monitor.getClientOffset() as XYCoord;
      if (offset && listRef.current) {
        const scrollTop = listRef.current.scrollTop;
        const y = offset.y + scrollTop - 100;

        let targetIndex = -1;
        let topOffset = 0;

        for (let i = 0; i < list.length; i++) {
          const itemElement = itemRefs.current[i];
          if (itemElement) {
            if (y > topOffset && y <= topOffset + itemElement.offsetHeight) {
              targetIndex = i;
              break;
            }
            topOffset += itemElement.offsetHeight;
          }
        }

        if (targetIndex === -1 && list.length > 0) {
          targetIndex = list.length;
        }

        if (hoverIndexRef.current !== targetIndex) {
          hoverIndexRef.current = targetIndex;
          setHoverIndex(targetIndex);
        }
      }
    },
    [list, itemRefs, listRef]
  );


  const resetHoverIndex = useCallback(() => {
    hoverIndexRef.current = null;
    setHoverIndex(null);
  }, []);

  return [hoverIndex, updateHoverIndex, resetHoverIndex] as const;
};

export default useHoverIndex;
