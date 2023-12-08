import { useDraggable } from "@dnd-kit/core";

interface WordBlockProps {
  id: string;
}

export const WordBlock = ({ id }: WordBlockProps) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {id}
    </div>
  );
};
