import { toast } from "react-toastify";
import { EnvelopeIcon } from "@heroicons/react/24/outline";
import { LoadingIcon } from "../Icons";

import { api } from "~/utils/api";
import type { Pelamar } from "@prisma/client";

interface ISendWhatsApp {
  refetch: () => void;
  person: Pelamar;
}

export const SendEmail = ({ person, refetch }: ISendWhatsApp) => {
  const mutation = api.pelamar.sendEmail.useMutation({
    onSuccess: ({ message }) => {
      toast.success(message);
      refetch();
    },
  });

  const handleSend = async () => {
    try {
      await mutation.mutateAsync({
        email: person.email,
        position: person.position,
        namaPelamar: person.name,
        interviewDate: person.interviewDate,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <button
      className={`inline ${person.invitedByEmail ? "text-gray-400" : "text-indigo-600 hover:text-indigo-900"}`}
      onClick={() => void handleSend()}
      disabled={person.invitedByEmail || mutation.isLoading}
    >
      {mutation.isLoading ? <LoadingIcon /> : <EnvelopeIcon className="h-6 w-6" />}
    </button>
  );
};
