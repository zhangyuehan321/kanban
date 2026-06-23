/** 看板任务 */
export type Task = {
  id: string;
  title: string;
};

/** 看板分组（列），包含一组任务 */
export type Board = {
  groupId: string;
  groupName: string;
  tasks: Task[];
};
