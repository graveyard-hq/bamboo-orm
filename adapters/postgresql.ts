import { Pool, QueryResult } from "pg";
import { DatabaseAdapter } from "../src";
import { Schema, QueryOptions } from "../src/index.d";

export class PostgresAdapter implements DatabaseAdapter {
  private pool: Pool;

  constructor(connectionUrl: string) {
    this.pool = new Pool({
      connectionString: connectionUrl,
    });
  }

  async createTable(tableName: string, schema: Schema): Promise<void> {
    let query = `CREATE TABLE IF NOT EXISTS ${tableName} (`;
    for (const [key, value] of Object.entries(schema)) {
      query += `${key} ${value}, `;
    }
    query = query.slice(0, -2);
    query += ")";

    await this.pool.query(query);
  }

  async dropTable(tableName: string): Promise<void> {
    const query = `DROP TABLE IF EXISTS ${tableName}`;

    await this.pool.query(query);
  }

  async selectAll<T>(tableName: string): Promise<T[]> {
    const result: QueryResult<T> = await this.pool.query<T>(
      `SELECT * FROM ${tableName}`
    );

    return result.rows;
  }

  async selectUnique<T>(
    tableName: string,
    conditions: QueryOptions
  ): Promise<T | null> {
    let query = `SELECT * FROM ${tableName}`;
    const values = Object.values(conditions);
    if (Object.keys(conditions).length > 0) {
      query += " WHERE ";
      const keys = Object.keys(conditions);
      query += keys.map((key, index) => `${key} = $${index + 1}`).join(" AND ");
    }
    query += " LIMIT 1";
    const result: QueryResult<T> = await this.pool.query<T>(query, values);

    return result.rows.length > 0 ? result.rows[0] : null;
  }

  async selectFirst<T>(
    tableName: string,
    conditions: QueryOptions
  ): Promise<T | null> {
    let query = `SELECT * FROM ${tableName}`;
    if (Object.keys(conditions).length > 0) {
      query += " WHERE ";
      const keys = Object.keys(conditions);
      query += keys.map((key) => `${key} = $${key}`).join(" AND ");
    }
    query += " LIMIT 1";
    const result: QueryResult<T> = await this.pool.query<T>(
      query,
      Object.values(conditions)
    );

    return result.rows.length > 0 ? result.rows[0] : null;
  }

  async insert(tableName: string, values: QueryOptions): Promise<void> {
    const keys = Object.keys(values);
    const columns = keys.join(", ");
    const placeholders = keys.map((_, index) => `$${index + 1}`).join(", ");
    const query = `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders})`;

    await this.pool.query(query, Object.values(values));
  }

  async update(
    tableName: string,
    values: QueryOptions,
    conditions: QueryOptions
  ): Promise<void> {
    const setValues = Object.entries(values).map(
      ([key, value]) => `${key} = $${value}`
    );
    const whereConditions = Object.entries(conditions).map(
      ([key, value]) => `${key} = $${value}`
    );
    const query = `UPDATE ${tableName} SET ${setValues.join(
      ", "
    )} WHERE ${whereConditions.join(" AND ")}`;

    await this.pool.query(query, [
      ...Object.values(values),
      ...Object.values(conditions),
    ]);
  }

  async delete(tableName: string, conditions: QueryOptions): Promise<void> {
    const whereConditions = Object.entries(conditions).map(
      ([key, value]) => `${key} = $${value}`
    );
    const query = `DELETE FROM ${tableName} WHERE ${whereConditions.join(
      " AND "
    )}`;

    await this.pool.query(query, Object.values(conditions));
  }

  async executeRaw<T>(query: string, params: any[] = []): Promise<T[]> {
    const result: QueryResult<T> = await this.pool.query<T>(query, params);
    return result.rows;
  }

  async count(
    tableName: string,
    conditions: QueryOptions = {}
  ): Promise<number> {
    let query = `SELECT COUNT(*) FROM ${tableName}`;
    const values = Object.values(conditions);
    if (Object.keys(conditions).length > 0) {
      query += " WHERE ";
      const keys = Object.keys(conditions);
      query += keys.map((key, index) => `${key} = $${index + 1}`).join(" AND ");
    }

    const result: QueryResult<{ count: number }> = await this.pool.query<{
      count: number;
    }>(query, values);
    return result.rows[0].count;
  }
}
