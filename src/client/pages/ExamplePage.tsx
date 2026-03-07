import { useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { RefreshCw, Plus, Calendar } from 'lucide-react';

type ExampleItem = {
  title: string;
  createdAt: Date;
};

export default function ExamplePage() {
  const { itemId } = useParams<{ itemId: string }>();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery<ExampleItem>({
    queryKey: ['example', itemId],
    queryFn: async () => {
      // Example API call - replace with actual endpoint
      return { title: 'Example Item', createdAt: new Date() };
    },
    enabled: !!itemId,
  });

  const { mutate: createItem, isPending: isCreatingItem } = useMutation({
    mutationFn: async (data: { title: string }) => {
      // Example API call - replace with actual endpoint
      return { title: data.title, createdAt: new Date() };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['example'] });
    }
  });

  const invalidateItem = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['example', itemId] });
  }, [queryClient, itemId]);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {error && <div>Error: {(error as Error).message}</div>}
      {data && (
        <>
          <h1>{data.title}</h1>
          <p className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            Created: {new Date(data.createdAt).toLocaleString()}
          </p>
        </>
      )}
      <button onClick={invalidateItem} className="flex items-center gap-1.5">
        <RefreshCw className="w-4 h-4" />
        Invalidate Item
      </button>
      <button onClick={() => createItem({ title: 'New Item' })} disabled={isCreatingItem} className="flex items-center gap-1.5">
        <Plus className="w-4 h-4" />
        Create Item
      </button>
    </div>
  );
}
