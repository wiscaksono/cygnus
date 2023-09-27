import { toast } from "react-toastify";

import { api } from "~/utils/api";

import type { Pelamar } from "@prisma/client";

interface ISendEmailAll {
  refetch: () => void;
  selectedPelamar: Pelamar[];
}

export const SendEmailAll = ({ refetch, selectedPelamar }: ISendEmailAll) => {
  if (!selectedPelamar.length) return;

  const mutation = api.pelamar.sendEmail.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const handleSend = async () => {
    for (const person of selectedPelamar) {
      await mutation.mutateAsync({
        email: person.email,
      });
    }
    toast.success(`Mengirim undangan ke pelamar yang dipilih`);
  };

  return (
    <button
      type="button"
      className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm transition-opacity hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-70"
      onClick={() => void handleSend()}
      disabled={mutation.isLoading || selectedPelamar.some((item) => item.invitedByEmail === true)}
    >
      {mutation.isLoading ? "Mengirim..." : "Kirim Email"}
    </button>
  );
};
