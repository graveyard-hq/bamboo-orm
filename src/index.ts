import { DatabaseAdapter, QueryOptions, Schema } from "./index.d";

class Willow {
  private db: DatabaseAdapter;

  constructor(db: DatabaseAdapter) {
    this.db = db;
  }

  async createTable(tableName: string, schema: Schema): Promise<void> {
    await this.db.createTable(tableName, schema);
  }

  async dropTable(tableName: string): Promise<void> {
    await this.db.dropTable(tableName);
  }

  async selectAll<T>(tableName: string): Promise<T[]> {
    return this.db.selectAll<T>(tableName);
  }

  async selectUnique<T>(
    tableName: string,
    conditions: QueryOptions
  ): Promise<T | null> {
    return this.db.selectUnique<T>(tableName, conditions);
  }

  async selectFirst<T>(
    tableName: string,
    conditions: QueryOptions
  ): Promise<T | null> {
    return this.db.selectFirst<T>(tableName, conditions);
  }

  async insert(tableName: string, values: QueryOptions): Promise<void> {
    await this.db.insert(tableName, values);
  }

  async update(
    tableName: string,
    values: QueryOptions,
    conditions: QueryOptions
  ): Promise<void> {
    await this.db.update(tableName, values, conditions);
  }

  async delete(tableName: string, conditions: QueryOptions): Promise<void> {
    await this.db.delete(tableName, conditions);
  }
}

export { Willow, DatabaseAdapter };
