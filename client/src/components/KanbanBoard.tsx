import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import API_BASE_URL from "../apiConfig";
import { setTasks, addTask, updateTask, deleteTask } from "../slices/taskSlice";
import { RootState } from "../store/store";
import { Column, Id, Task, ServerTask, Status, Priority } from "../types";
import ColumnContainer from "./ColumnContainer";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import TaskCard from "./TaskCard";

const columns: Column[] = [
  {
    id: Status.ToDo.toLowerCase(),
    title: Status.ToDo,
  },
  {
    id: Status.InProgress.toLowerCase(),
    title: Status.InProgress,
  },
  {
    id: Status.Done.toLowerCase(),
    title: Status.Done,
  },
];

// const defaultTasks: Task[] = [
//   {
//     id: "1",
//     columnId: Status.ToDo.toLowerCase(),
//     title: "List admin APIs for dashboard",
//     dueDate: new Date(),
//     status: Status.ToDo,
//     priority: Priority.Low,
//   },
//   {
//     id: "2",
//     columnId: Status.ToDo.toLowerCase(),
//     title:
//       "Develop user registration functionality with OTP delivered on SMS after email confirmation and phone number confirmation",
//     dueDate: new Date(),
//     status: Status.ToDo,
//     priority: Priority.High,
//   },
//   {
//     id: "3",
//     columnId: Status.InProgress.toLowerCase(),
//     title: "Conduct security testing",
//     dueDate: new Date(),
//     status: Status.ToDo,
//     priority: Priority.Medium,
//     assigneeId: "1",
//     assigneeName: "Dasha Harashchuk",
//   },
// ];

function KanbanBoard() {
  const dispatch = useDispatch();
  const tasks = useSelector((state: RootState) => state.tasks).tasks;
  console.log(tasks);

  const [activeColumn, setActiveColumn] = useState<Column | null>(null);

  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  function mapStatus(statusString: string): Status {
    const statusWithoutSpaces = statusString.replace(/\s/g, "");
    return Status[statusWithoutSpaces as keyof typeof Status];
  }

  //
  function mapPriority(priorityString: string): Priority {
    return Priority[priorityString as keyof typeof Priority];
  }

  useEffect(() => {
    console.log("inside");
    fetch(`${API_BASE_URL}/api/tasks/`)
      .then((response) => response.json())
      .then((data) => {
        console.log("data", data);
        const tasks: Task[] = data.map((task: ServerTask) => ({
          id: task.id,
          columnId: task.status.toLowerCase(),
          title: task.title,
          description: task.description,
          dueDate: task.due_date,
          status: mapStatus(task.status),
          priority: mapPriority(task.priority),
          // TODO user mapping (assigneeId, assigneeName)
        }));
        console.log("mapper tasks", tasks);
        dispatch(setTasks(tasks)); // Dispatch the transformed tasks
      })
      .catch((error) => {
        console.error("Error fetching tasks:", error);
      });
  }, [dispatch]);

  return (
    <div
      className="
        m-auto
        flex
        min-h-screen
        w-full
        items-center
        overflow-x-auto
        overflow-y-hidden
        px-[40px]
    "
    >
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
      >
        <div className="m-auto flex gap-4">
          <div className="flex gap-4">
            <SortableContext items={columns.map((col) => col.id)}>
              {columns.map((col) => (
                <ColumnContainer
                  key={col.id}
                  column={col}
                  createTask={createTask}
                  deleteTask={deleteTaskRedux}
                  //   updateTask={updateTaskRedux}
                  tasks={tasks.filter((task: Task) => task.columnId === col.id)}
                />
              ))}
            </SortableContext>
          </div>
        </div>

        {createPortal(
          <DragOverlay>
            {activeColumn && (
              <ColumnContainer
                column={activeColumn}
                createTask={createTask}
                deleteTask={deleteTaskRedux}
                // updateTask={updateTaskRedux}
                tasks={tasks.filter(
                  (task) => task.columnId === activeColumn.id
                )}
              />
            )}
            {activeTask && (
              <TaskCard
                task={activeTask}
                deleteTask={deleteTaskRedux}
                // updateTask={updateTaskRedux}
              />
            )}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );

  function createTask(columnId: Id) {
    const newTask: Task = {
      id: generateId(), // TODO remove generated id
      columnId,
      title: `Task ${tasks.length + 1}`,
      description: "",
      priority: Priority.Low,
      status: Status.ToDo,
    };

    dispatch(addTask(newTask));
  }

  //   function updateTaskRedux(id: Id, title: string) {
  //     dispatch(updateTask({ id, title }));
  //   }

  function deleteTaskRedux(id: Id) {
    dispatch(deleteTask(id.toString()));
  }

  function onDragStart(event: DragStartEvent) {
    if (event.active.data.current?.type === "Column") {
      setActiveColumn(event.active.data.current.column);
      return;
    }

    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
      return;
    }
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveColumn(null);
    setActiveTask(null);

    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveAColumn = active.data.current?.type === "Column";
    if (!isActiveAColumn) return;

    console.log("DRAG END");
  }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveATask = active.data.current?.type === "Task";
    const isOverATask = over.data.current?.type === "Task";

    if (!isActiveATask) return;

    // Im dropping a Task over another Task
    // if (isActiveATask && isOverATask) {
    //   setTasks((tasks) => {
    //     const activeIndex = tasks.findIndex((t) => t.id === activeId);
    //     const overIndex = tasks.findIndex((t) => t.id === overId);

    //     if (tasks[activeIndex].columnId !== tasks[overIndex].columnId) {
    //       // Fix introduced after video recording
    //       tasks[activeIndex].columnId = tasks[overIndex].columnId;
    //       return arrayMove(tasks, activeIndex, overIndex - 1);
    //     }

    //     return arrayMove(tasks, activeIndex, overIndex);
    //   });
    // }

    const isOverAColumn = over.data.current?.type === "Column";

    // Im dropping a Task over a column
    // if (isActiveATask && isOverAColumn) {
    //   setTasks((tasks) => {
    //     const activeIndex = tasks.findIndex((t) => t.id === activeId);

    //     tasks[activeIndex].columnId = overId;
    //     return arrayMove(tasks, activeIndex, activeIndex);
    //   });
    // }
  }
}

function generateId() {
  /* Generate a random number between 0 and 10000 */
  return Math.floor(Math.random() * 10001);
}

export default KanbanBoard;
