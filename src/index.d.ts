interface Schema {
  [key: string]: string;
}

interface QueryOptions {
  [key: string]: any;
}

interface DatabaseAdapter {
  createTable(tableName: string, schema: Schema): Promise<void>;
  dropTable(tableName: string): Promise<void>;
  selectAll<T>(tableName: string): Promise<T[]>;
  selectUnique<T>(
    tableName: string,
    conditions: QueryOptions
  ): Promise<T | null>;
  selectFirst<T>(
    tableName: string,
    conditions: QueryOptions
  ): Promise<T | null>;
  insert(tableName: string, values: QueryOptions): Promise<void>;
  update(
    tableName: string,
    values: QueryOptions,
    conditions: QueryOptions
  ): Promise<void>;
  delete(tableName: string, conditions: QueryOptions): Promise<void>;
}

export { DatabaseAdapter, Schema, QueryOptions };
