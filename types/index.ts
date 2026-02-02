export type TreeItemType = string | [string, ...TreeItemType[]];

export type ProjectTypes = {
  id: string,
  name: string,
  userId: string,
  updatedAt: Date
}