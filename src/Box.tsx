import { useSortable } from "@dnd-kit/sortable";
import { Column } from "./Column";
import { WordBlock } from "./WordBlock";

interface BoxProps {
  items: string[];
}

export const Box = ({ items }: BoxProps) => {
  return (
    <Column color="bg-blue-400" id="box" items={items}>
      {items.map((item) => (
        <SortableItem key={item} id={`box-${item}`}>
          <WordBlock id={item} />
        </SortableItem>
      ))}
    </Column>
  );
};

interface SortableItemProps {
  id: string;
  children: React.ReactNode;
}

export const SortableItem = ({ id, children }: SortableItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: `translate3d(${transform?.x}px, ${transform?.y}px, 0)`,
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
};
