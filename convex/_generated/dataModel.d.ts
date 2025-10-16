// Auto-generated type stubs for development
// These will be replaced by 'npx convex dev'

export type DataModel = {
  "todos": any;
  "userPreferences": any;
};

export type TableNames = "todos" | "userPreferences";

export type Id<TableName extends TableNames> = string & { __tableName: TableName };
export type Doc<TableName extends TableNames> = any;
