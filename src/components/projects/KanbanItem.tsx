import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface KanbanItemProps {
  id: string;
  content: string;
}

export default function KanbanItem({ id, content }: KanbanItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`p-4 mb-2 bg-white border rounded-lg shadow-sm cursor-move hover:bg-gray-50 ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      {content}
    </div>
  );
}