import { supabase } from "@/lib/supabase/client";

export class BaseRepository<T = any> {
  constructor(public tableName: string) {}

  async findAll(): Promise<T[]> {
    const { data, error } = await supabase.from(this.tableName).select("*");
    if (error) throw new Error(error.message);
    return data ?? [];
  }

  async findById(id: number | string): Promise<T | null> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw new Error(error.message);
    return data ?? null;
  }

  async create(data: Partial<T>) {
    const { data: inserted, error } = await supabase
      .from(this.tableName)
      .insert(data)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return inserted;
  }

  async update(id: number | string, data: Partial<T>) {
    const { data: updated, error } = await supabase
      .from(this.tableName)
      .update(data)
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return updated;
  }

  async delete(id: number | string) {
    const { error } = await supabase
      .from(this.tableName)
      .delete()
      .eq("id", id);

    if (error) throw new Error(error.message);
  }
}
