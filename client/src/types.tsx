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

export interface Task {
  id: Id;
  columnId: Id;
  title: string;
  description: string;
  dueDate?: string;
  status: Status;
  priority: Priority;
  assigneeId?: Id;
  assigneeName?: string;
}

export interface ServerTask {
  id: number;
  title: string;
  description: string;
  due_date: string;
  status: string;
  priority: string;
  assigneeId?: number;
  assigneeName?: string;
}

export interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  authToken: string;
}
