import {
  DndContext,
  useDraggable,
  useDroppable,
  closestCenter,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
import { clsx } from "clsx";
import { Toaster, toast } from "sonner";

type BoxItemProps = {
  id: number;
  title: string;
};

export const BoxItem = ({ id, title }: BoxItemProps) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
    data: { originalColumn: "box" }, // replace 'box' with the ID of the original column
  });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="bg-white shadow rounded p-2 max-w-[300px]"
    >
      {title}
    </div>
  );
};

type ColumnItemProps = {
  id: string;
  color: string;
  title: string;
  children: React.ReactNode;
};

export const ColumnItem = ({ id, color, title, children }: ColumnItemProps) => {
  const { setNodeRef } = useDroppable({
    id,
  });

  return (
    <div className={clsx(color, "flex flex-col justify-between h-full")}>
      <h2 className={clsx("bg-white text-center font-semibold text-xl")}>
        {title}
      </h2>
      <div
        className={clsx(
          "overflow-auto p-2 w-full h-[12rem] md:h-[600px] md:w-[450px] flex flex-wrap mx-auto gap-2 justify-center items-center"
        )}
        ref={setNodeRef}
      >
        {children}
      </div>
    </div>
  );
};

export type item = {
  id: number;
  title: string;
};

export default function App() {
  const goodToShare = [2, 3, 6, 7, 13, 14, 15, 17, 20];
  const shouldNotShare = [1, 4, 5, 8, 9, 10, 11, 12, 16, 18, 19];
  const [items, setItems] = useState<{
    box: item[];
    column1: item[];
    column2: item[];
  }>({
    box: [
      { id: 1, title: "Nom de famille" },
      { id: 2, title: "Prénom" },
      { id: 3, title: "Couleur préférée" },
      { id: 4, title: "Adresse personnelle" },
      { id: 5, title: "Numéro de téléphone" },
      { id: 6, title: "Animal préféré" },
      { id: 7, title: "Saison préférée" },
      { id: 8, title: "Adresse e-mail" },
      { id: 9, title: "Mot de passe" },
      { id: 10, title: "Réponses aux questions de sécurité" },
      { id: 11, title: "Numéro de carte de crédit" },
      { id: 12, title: "Numéro de sécurité sociale" },
      { id: 13, title: "Chanteur ou groupe de musique préféré" },
      { id: 14, title: "Sport préféré" },
      { id: 15, title: "Pays préféré" },
      { id: 16, title: "Carte d'identité ou passeport" },
      { id: 17, title: "Activité favorite" },
      { id: 18, title: "Numéro de permis de conduire" },
      { id: 19, title: "Infos sur la santé" },
      { id: 20, title: "Série préférée" },
    ],
    column1: [],
    column2: [],
  });

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (active && over) {
      setItems((prevItems) => {
        let fromKey: keyof typeof prevItems | null = null;
        for (const key in prevItems) {
          if (
            prevItems[key as keyof typeof prevItems].find(
              (item) => item.id === active.id
            )
          ) {
            fromKey = key as keyof typeof prevItems;
            break;
          }
        }

        if (!fromKey) {
          return prevItems;
        }

        const toKey = over.id as keyof typeof prevItems;

        // If the item is dropped in the same column, don't change the state
        if (fromKey === toKey) {
          return prevItems;
        }

        const itemToMove = prevItems[fromKey].find(
          (item) => item.id === active.id
        );
        if (!itemToMove) {
          return prevItems;
        }

        const newItems = {
          ...prevItems,
          [fromKey]: prevItems[fromKey].filter((item) => item.id !== active.id),
          [toKey]: [...prevItems[toKey], itemToMove],
        };

        // Check if all items have been moved out of the box
        if (newItems.box.length === 0) {
          const idsInColumn1 = new Set(newItems.column1.map((item) => item.id));
          const idsInColumn2 = new Set(newItems.column2.map((item) => item.id));

          // Check if items 1, 2, 3 are in column1 and items 4, 5 are in column2
          if (
            shouldNotShare.every((id) =>
              // [1, 4, 5, 8, 9, 10, 11, 12, 16, 18, 19].every((id) =>
              idsInColumn2.has(id)
            ) &&
            goodToShare.every((id) =>
              // [2, 3, 6, 7, 13, 14, 15, 17, 20].every((id) =>
              idsInColumn1.has(id)
            )
          ) {
            toast.success("Bravo, tu as réussi !");
          } else {
            toast.error("Mauvaise réponse !");
          }
        }

        return newItems;
      });
    }
  }

  return (
    <div className="flex md:flex-row flex-col gap-2 w-full p-8">
      <Toaster />
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <ColumnItem
          id="box"
          color="bg-blue-400"
          title="↔️ Déplace-moi dans la bonne colonne"
        >
          {items.box.map((item) => (
            <BoxItem id={item.id} key={item.id} title={item.title} />
          ))}
        </ColumnItem>
        <ColumnItem
          id="column1"
          color="bg-green-400"
          title="✅ Ce que je peux partager en ligne"
        >
          {items.column1.map((item) => (
            <BoxItem id={item.id} key={item.id} title={item.title} />
          ))}
        </ColumnItem>
        <ColumnItem
          id="column2"
          color="bg-red-400"
          title="❌ Ce que je ne dois pas partager en ligne"
        >
          {items.column2.map((item) => (
            <BoxItem id={item.id} key={item.id} title={item.title} />
          ))}
        </ColumnItem>
      </DndContext>
    </div>
  );
}
