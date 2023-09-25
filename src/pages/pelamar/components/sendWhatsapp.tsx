import { toast } from "react-toastify";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";

import { api } from "~/utils/api";
import type { Pelamar } from "@prisma/client";

interface ISendWhatsApp {
  refetch: () => void;
  person: Pelamar;
}

export const SendWhatsApp = ({ person, refetch }: ISendWhatsApp) => {
  const mutation = api.pelamar.sendWhatsApp.useMutation({
    onSuccess: ({ message }) => {
      toast.success(message);
      refetch();
    },
  });

  const { data } = api.user.getSelf.useQuery();

  if (!data) return;

  const handleSend = async () => {
    await mutation.mutateAsync({
      number: person.phone,
      message: data.templateWhatsApp,
    });
  };

  return (
    <button
      className={`inline ${person.invitedByWhatsapp || !person.hasWhatsapp
          ? "text-gray-400"
          : "text-indigo-600 hover:text-indigo-900"
        }`}
      onClick={() => void handleSend()}
      disabled={
        person.invitedByWhatsapp || !person.hasWhatsapp || mutation.isLoading
      }
    >
      {mutation.isLoading ? (
        <LoadingIcon />
      ) : (
        <PaperAirplaneIcon className="h-6 w-6 -rotate-45" />
      )}
    </button>
  );
};

const LoadingIcon = () => {
  return (
    <svg
      fill="none"
      className="h-6 w-6 animate-spin text-indigo-600"
      viewBox="0 0 24 24"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
        className="opacity-25"
      />
      <path
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        className="opacity-75"
      />
    </svg>
  );
};
