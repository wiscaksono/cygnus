import { toast } from "react-toastify";
import { LoadingIcon } from "../Icons";
import { DocumentArrowUpIcon } from "@heroicons/react/24/outline";

import { api } from "~/utils/api";
import type { Pelamar } from "@prisma/client";

interface ISendWhatsApp {
  refetch: () => void;
  person: Pelamar;
}

export const AddToTracking = ({ person, refetch }: ISendWhatsApp) => {
  const mutation = api.trackingPelamar.create.useMutation({
    onSuccess: ({ message }) => {
      toast.success(message);
      refetch();
    },
  });

  const handleSend = async () => {
    await mutation.mutateAsync({
      id: person.id,
      name: person.name,
      phone: person.phone,
    });
  };

  return (
    <button
      className={`inline ${(!person.invitedByWhatsapp && !person.invitedByEmail) || person.onTracking ? "text-gray-400" : "text-indigo-600 hover:text-indigo-900"}`}
      onClick={() => void handleSend()}
      disabled={(!person.invitedByWhatsapp && !person.invitedByEmail) || person.onTracking}>
      {mutation.isLoading ? <LoadingIcon /> : <DocumentArrowUpIcon className="h-6 w-6" />}
    </button>
  );
};
