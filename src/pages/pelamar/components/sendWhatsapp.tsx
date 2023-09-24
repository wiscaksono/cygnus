import { toast } from "react-toastify";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { Pelamar } from "@prisma/client";
import { format } from "date-fns";
import { id } from "date-fns/locale";

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

  const messageTemplate = `Halo *${person.name}*,

Salam dari Royal Trust,
Saya Pratiwi, Recruitment Specialist dari Royal Trust. Saya telah melihat lamaran sdr melalui *Email: hrd3@royalfx.co.id*  dan melamar pada posisi *${person.position
    }*. Kami ingin mengundang sdr/i agar turut hadir dalam seleksi wawancara yang akan diadakan pada:

Hari & Tanggal : _${format(person.interviewDate, "EEEE, dd MMMM yyyy", {
      locale: id,
    })}_
Jam                   : ${format(person.interviewDate, "hh:mm", {
      locale: id,
    })} - Selesai
Lokasi               : Belleza Shopping Arcade, Lt. 2 Unit 61 - 63, Jl. Arteri Permata Hijau No. 34, Kel. Grogol Utara, Kec. Kebayoran Lama, Kota Jakarta Selatan, DKI Jakarta

Dengan demikian, apakah sdr/i berkenan untuk mengikuti proses rekrutmen pada posisi tersebut? Diharapkan sdr/i yang menerima pesan ini untuk mengkonfirmasi kehadiran dengan format balasan: Nama-hadir/ tidak hadir.

Masukan Anda sangat berarti.
Terima kasih
`;

  const handleSend = async () => {
    await mutation.mutateAsync({
      number: person.phone,
      message: messageTemplate,
    });
  };

  return (
    <button
      className={`inline ${person.invitedByWhatsapp
        ? "text-gray-400"
        : "text-indigo-600 hover:text-indigo-900"
        }`}
      onClick={handleSend}
    // disabled={person.invitedByWhatsapp}
    >
      <PaperAirplaneIcon className="h-4 w-4 -rotate-45" />
    </button>
  );
};
