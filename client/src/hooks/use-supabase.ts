
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export function useSupabaseData(table: string) {
  return useQuery({
    queryKey: [table],
    queryFn: async () => {
      const { data, error } = await supabase
        .from(table)
        .select('*');
      
      if (error) throw error;
      return data;
    }
  });
}
