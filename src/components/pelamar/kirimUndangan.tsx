import { toast } from "react-toastify";
import { format } from "date-fns";
import { id } from "date-fns/locale";

import { api } from "~/utils/api";

import type { Pelamar } from "@prisma/client";

interface IKirimUndangan {
  refetch: () => void;
  selectedPelamar: Pelamar[];
}

export const KirimUndangan = ({ refetch, selectedPelamar }: IKirimUndangan) => {
  if (!selectedPelamar.length) return;

  const mutation = api.pelamar.sendWhatsApp.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const handleSend = async () => {
    for (const person of selectedPelamar) {
      if (!person.phone) {
        toast.error(`Nomor HP ${person.name} tidak ditemukan`);
        return;
      }
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

      await mutation.mutateAsync({
        number: person.phone,
        message: messageTemplate,
      });

      toast.success(`Mengirim undangan ke ${person.name}`);
    }
  };

  return (
    <button
      type="button"
      className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm transition-opacity hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-70"
      onClick={() => void handleSend()}
      disabled={mutation.isLoading}
    >
      {mutation.isLoading ? "Mengirim..." : "Kirim Undangan"}
    </button>
  );
};
