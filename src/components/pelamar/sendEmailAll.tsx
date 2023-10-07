import { toast } from "react-toastify";

import { api } from "~/utils/api";

import type { Pelamar } from "@prisma/client";

interface ISendEmailAll {
  refetch: () => void;
  selectedPelamar: Pelamar[];
  setSelectedPelamar: (value: Pelamar[]) => void;
}

export const SendEmailAll = ({ refetch, selectedPelamar, setSelectedPelamar }: ISendEmailAll) => {
  if (!selectedPelamar.length) return;

  const cleanedPelamar = removeDuplicatesByEmail(selectedPelamar);

  const mutation = api.pelamar.sendEmail.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const handleSend = async () => {
    const promises = [];

    for (const person of cleanedPelamar) {
      promises.push(
        mutation.mutateAsync({
          id: person.id,
          email: person.email,
          interviewDate: person.interviewDate,
          position: person.position,
          namaPelamar: person.name,
          portal: person.portal,
        }),
      );
    }

    await Promise.all(promises);
    setSelectedPelamar([]);
    toast.success(`Mengirim undangan ke pelamar yang dipilih`);
  };

  return (
    <button
      type="button"
      className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm transition-opacity hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-70"
      onClick={() => void handleSend()}
      disabled={mutation.isLoading || selectedPelamar.some((item) => item.invitedByEmail === true)}>
      {mutation.isLoading ? "Mengirim..." : "Kirim Email"}
    </button>
  );
};

function removeDuplicatesByEmail(arr: Pelamar[]): Pelamar[] {
  const uniqueApplicants: Record<string, boolean> = {};
  const result: Pelamar[] = [];

  for (const applicant of arr) {
    if (!uniqueApplicants[applicant.email]) {
      uniqueApplicants[applicant.email] = true;
      result.push(applicant);
    }
  }

  return result;
}
