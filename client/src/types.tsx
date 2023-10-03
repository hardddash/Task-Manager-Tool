export enum Priority {
  Low = "Low",
  Medium = "Medium",
  High = "High",
}

export enum Status {
  ToDo = "To Do",
  InProgress = "In Progress",
  Done = "Done",
}

export type Id = string | number;

export type Column = {
  id: Id;
  title: string;
};

export type Task = {
  id: Id;
  columnId: Id;
  title: string;
  description?: string;
  dueDate?: Date;
  status: Status;
  priority: Priority;
  assigneeId?: Id;
  assigneeName?: string;
};
