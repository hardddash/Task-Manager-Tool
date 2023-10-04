import { useState } from "react";
import TrashIcon from "../icons/TrashIcon";
import PriorityBox from "./PriorityBox";
import { Id, Task } from "../types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Props {
  task: Task;
  deleteTask: (id: Id) => void;
//   updateTask: (id: Id, title: string) => void;
}

function TaskCard({ task, deleteTask, /* updateTask */ }: Props) {
  const [mouseIsOver, setMouseIsOver] = useState(false);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="
        opacity-30
      bg-mainBackgroundColor p-2.5 h-[100px] min-h-[100px] items-center flex text-left rounded-xl border-2 border-rose-500  cursor-grab relative
      "
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-mainBackgroundColor p-2.5 items-center flex text-left rounded-xl hover:ring-2 hover:ring-inset hover:ring-rose-500 cursor-grab relative task"
      onMouseEnter={() => {
        setMouseIsOver(true);
      }}
      onMouseLeave={() => {
        setMouseIsOver(false);
      }}
    >
      <div className="flex flex-col w-full">
        <p className="my-auto overflow-y-auto overflow-x-hidden whitespace-pre-wrap mb-2">
          <b>{task.title}</b>
        </p>
        {task.dueDate &&
            <p className="my-auto overflow-y-auto overflow-x-hidden whitespace-pre-wrap">
            <small>{task.dueDate}</small>
            </p>
        }
        {task.assigneeName && (
          <p className="my-auto overflow-y-auto overflow-x-hidden whitespace-pre-wrap">
            <small>{task.assigneeName}</small>
          </p>
        )}
        {task.priority && <div className="mt-1"><PriorityBox priority={task.priority} /> </div>}
      </div>

      {mouseIsOver && (
        <button
          onClick={() => {
            deleteTask(task.id);
          }}
          className="stroke-white absolute right-4 top-1/2 -translate-y-1/2 bg-columnBackgroundColor p-2 rounded opacity-60 hover:opacity-100"
        >
          <TrashIcon />
        </button>
      )}
    </div>
  );
}

export default TaskCard;
