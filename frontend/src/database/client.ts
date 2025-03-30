import { Database, Tables } from '@/database/database.types';
import { SupabaseClient, createClient } from '@supabase/supabase-js';

import { logger } from '@/lib/logger';

let supabaseClient: SupabaseClient | null = null;

export async function getSupabaseClient(): Promise<SupabaseClient> {
  if (!supabaseClient) {
    const supabaseKey: string | undefined = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!supabaseKey) {
      const errorMessage: string = 'SUPABASE_KEY is not set';
      logger.error(errorMessage);
      throw new Error(errorMessage);
    }
    const supabaseUrl: string | undefined = process.env.SUPABASE_URL;
    if (!supabaseUrl) {
      const errorMessage: string = 'SUPABASE_URL is not set';
      logger.error(errorMessage);
      throw new Error(errorMessage);
    }
    supabaseClient = createClient(supabaseUrl, supabaseKey);
  }

  return supabaseClient;
}

type TableName = keyof Database['public']['Tables'];
type Row<T extends TableName> = Tables<T>;

export async function GET<T extends TableName>(
  tableName: T,
  filterConditions?: Partial<Row<T>>,
): Promise<Row<T>[]> {
  // const users = await GET("users", { gender: "male" });
  logger.info(
    `GET request invoked on ${tableName} with filter conditions: ${JSON.stringify(filterConditions)}`,
  );

  const client = await getSupabaseClient();
  let query = client.from(tableName).select('*');

  if (filterConditions) {
    Object.entries(filterConditions).forEach(([column, value]) => {
      query = query.eq(column, value);
    });
  }
  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return data as Row<T>[];
}

export async function POST<T extends TableName>(
  tableName: T,
  data: Partial<Row<T>>[],
): Promise<Row<T>[]> {
  // const users: Row<User>[] = await POST("users", {
  //   gender: "male",
  //   ...
  //   ...
  // });
  const client = await getSupabaseClient();

  const filteredData = data.map(
    (row) => Object.fromEntries(Object.entries(row).filter(([_, value]) => value != null)), // eslint-disable-line @typescript-eslint/no-unused-vars
  );

  const { data: insertedData, error } = await client.from(tableName).insert(filteredData).select();

  if (error) {
    throw error;
  }

  return insertedData as Row<T>[];
}

export async function UPDATE<T extends TableName>(
  tableName: T,
  filterConditions: Partial<Row<T>>,
  updateData: Partial<Row<T>>,
): Promise<Row<T>[]> {
  // const updatedUsers = await UPDATE(
  //   "users",
  //   { gender: "male" },
  //   { email: "male_user@email.com" }
  // );

  const client = await getSupabaseClient();
  let query = client.from(tableName).update(updateData);

  Object.entries(filterConditions).forEach(([column, value]) => {
    query = query.eq(column, value);
  });

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return data as unknown as Row<T>[];
}

export async function DELETE<T extends TableName>(
  tableName: T,
  filterConditions: Partial<Row<T>>,
): Promise<Row<T>[]> {
  // const deletedUsers = await DELETE("users", { gender: "suveen" });

  const client = await getSupabaseClient();
  let query = client.from(tableName).delete();

  Object.entries(filterConditions).forEach(([column, value]) => {
    query = query.eq(column, value);
  });

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return data as unknown as Row<T>[];
}
