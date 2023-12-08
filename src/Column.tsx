import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { WordBlock } from "./WordBlock";
import { SortableItem } from "./Box";

interface ColumnProps {
  children?: React.ReactNode;
  id: string;
  color: string;
  items: string[]; // Add items to ColumnProps
}

export const Column = ({ id, color, items }: ColumnProps) => {
  const { setNodeRef, isOver, attributes, listeners, transform, transition } =
    useSortable({
      id,
    });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    minWidth: "250px",
    minHeight: "650px",
    backgroundColor: isOver ? "lightgreen" : color, // Change color when item is over
  };

  return (
    <div
      style={style}
      className={color}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
    >
      {items.map((item) => (
        <SortableItem key={item} id={`${id}-${item}`}>
          <WordBlock id={item} />
        </SortableItem>
      ))}
    </div>
  );
};
