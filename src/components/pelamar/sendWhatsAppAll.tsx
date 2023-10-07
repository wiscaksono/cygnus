import { toast } from "react-toastify";

import { api } from "~/utils/api";

import type { Pelamar } from "@prisma/client";

interface ISendWhatsAppAll {
  refetch: () => void;
  selectedPelamar: Pelamar[];
  setSelectedPelamar: (value: Pelamar[]) => void;
}

export const SendWhatsAppAll = ({ refetch, selectedPelamar, setSelectedPelamar }: ISendWhatsAppAll) => {
  if (!selectedPelamar.length) return;

  const cleanedPelamar = removeDuplicatesByPhone(selectedPelamar);

  const mutation = api.pelamar.sendWhatsApp.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const handleSend = async () => {
    for (const person of cleanedPelamar) {
      await mutation.mutateAsync({
        id: person.id,
        number: person.phone,
      });
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    toast.success(`Mengirim undangan ke pelamar yang dipilih`);
    setSelectedPelamar([]);
  };

  return (
    <button
      type="button"
      className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm transition-opacity hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-70"
      onClick={() => void handleSend()}
      disabled={mutation.isLoading || selectedPelamar.some((item) => item.hasWhatsapp === false) || selectedPelamar.some((item) => item.invitedByWhatsapp === true)}>
      {mutation.isLoading ? "Mengirim..." : "Kirim WhatsApp"}
    </button>
  );
};

function removeDuplicatesByPhone(arr: Pelamar[]): Pelamar[] {
  const uniqueApplicants: Record<string, boolean> = {};
  const result: Pelamar[] = [];

  for (const applicant of arr) {
    if (!uniqueApplicants[applicant.phone]) {
      uniqueApplicants[applicant.phone] = true;
      result.push(applicant);
    }
  }

  return result;
}
