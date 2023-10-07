import { toast } from "react-toastify";
import { WhatsAppIcon, LoadingIcon } from "../Icons";

import { api } from "~/utils/api";
import type { Pelamar } from "@prisma/client";

interface ISendWhatsApp {
  refetch: () => void;
  person: Pelamar;
}

export const SendWhatsApp = ({ person, refetch }: ISendWhatsApp) => {
  const mutation = api.pelamar.sendWhatsApp.useMutation({
    onSuccess: ({ message, status }) => {
      if (status !== 200) return toast.error(message);
      toast.success(message);
      refetch();
    },
  });

  const handleSend = async () => {
    await mutation.mutateAsync({
      id: person.id,
      number: person.phone,
    });
  };

  return (
    <button
      className={`inline ${person.invitedByWhatsapp || !person.hasWhatsapp ? "text-gray-400" : "text-indigo-600 hover:text-indigo-900"}`}
      onClick={() => void handleSend()}
      disabled={person.invitedByWhatsapp || !person.hasWhatsapp || mutation.isLoading}>
      {mutation.isLoading ? <LoadingIcon /> : <WhatsAppIcon />}
    </button>
  );
};
