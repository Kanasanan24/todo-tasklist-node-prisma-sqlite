interface SearchTask {
  search: string,
  page: number,
  pageSize: number,
  sortField: "id" | "task_name" | "created_at",
  sortOrder: "asc" | "desc"
}

export {
  SearchTask
}