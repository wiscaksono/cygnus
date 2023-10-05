import { TrashIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";

import { api } from "~/utils/api";
import { LoadingIcon } from "../Icons";

import type { TrackingPelamar } from "@prisma/client";

export const Delete = ({ pelamar, refetch }: { pelamar: TrackingPelamar; refetch: () => void }) => {
  const mutation = api.trackingPelamar.delete.useMutation({
    onSuccess: ({ message }) => {
      toast.success(message);
      refetch();
    },
  });

  const handleDelete = async () => {
    await mutation.mutateAsync({
      id: pelamar.id,
    });
  };

  return (
    <button disabled={mutation.isLoading} onClick={() => void handleDelete()}>
      {mutation.isLoading ? <LoadingIcon /> : <TrashIcon className="h-6 w-6 text-red-500" />}
    </button>
  );
};
