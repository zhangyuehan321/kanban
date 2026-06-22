export type Task = {
  id: string;
  title: string;
};

export type Board = {
  groupId: string;
  groupName: string;
  tasks: Task[];
};
