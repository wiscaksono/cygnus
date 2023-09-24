import { toast } from "react-toastify";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { Pelamar } from "@prisma/client";

import { api } from "~/utils/api";

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

  const handleSend = async () => {
    await mutation.mutateAsync({
      number: person.phone,
      message: data?.templateWhatsApp!,
    });
  };

  return (
    <button
      className={`inline ${person.invitedByWhatsapp || !person.hasWhatsapp
          ? "text-gray-400"
          : "text-indigo-600 hover:text-indigo-900"
        }`}
      onClick={handleSend}
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

const messageTemplate = `Halo *{{person}}*,

Salam dari Royal Trust,
Saya Pratiwi, Recruitment Specialist dari Royal Trust. Saya telah melihat lamaran sdr melalui *Email: hrd3@royalfx.co.id*  dan melamar pada posisi *{{position}}*. Kami ingin mengundang sdr/i agar turut hadir dalam seleksi wawancara yang akan diadakan pada:

Hari & Tanggal : {{date}}
Jam                   : {{interviewDate}} - Selesai
Lokasi               : Belleza Shopping Arcade, Lt. 2 Unit 61 - 63, Jl. Arteri Permata Hijau No. 34, Kel. Grogol Utara, Kec. Kebayoran Lama, Kota Jakarta Selatan, DKI Jakarta

Dengan demikian, apakah sdr/i berkenan untuk mengikuti proses rekrutmen pada posisi tersebut? Diharapkan sdr/i yang menerima pesan ini untuk mengkonfirmasi kehadiran dengan format balasan: Nama-hadir/ tidak hadir.

Masukan Anda sangat berarti.
Terima kasih
`;
