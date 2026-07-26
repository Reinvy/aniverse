/**
 * AniVerse Daily Story — July 26, 2026
 * Genre: Drama (Emotional)
 * Chapter 1: "Senja di Ujung Pelangi"
 *
 * Sunday feature: Drama/Emotional — a heartfelt story about love, loss,
 * and the quiet beauty of letting go.
 */

export interface StoryChapter {
  title: string;
  genre: string;
  chapterNumber: number;
  content: string;
  wordCount: number;
  date: string;
  author: string;
  description: string;
  tags: string[];
}

export const chapter: StoryChapter = {
  title: "Senja di Ujung Pelangi",
  genre: "Drama",
  chapterNumber: 1,
  date: "2026-07-26",
  author: "AniVerse Storyteller",
  description:
    "Seorang perempuan bernama Arum kembali ke kampung halamannya setelah kematian ayahnya, dan menemukan sebuah kotak surat tua yang berisi rahasia yang mengubah segalanya.",
  tags: ["drama", "emotional", "family", "kehilangan", "kenangan", "reconciliation"],
  content: [
    "Bab 1: Senja di Ujung Pelangi\n",
    "Arum tidak menangis di pemakaman ayahnya.\n",
    "Dia berdiri di antara deretan kursi lipat, mengenakan kebaya hitam yang terasa sesak di dadanya, sementara kerabat dan tetangga bergantian menyalami dan mengucapkan belasungkawa. Bibirnya tersenyum tipis, kepalanya mengangguk sopan, dan di dalam hatinya—hampa. Kosong seperti rumah tua yang ditinggalkan. Seperti lemari ayah yang masih menyimpan bau kopi dan tembakau. Seperti kursi goyang di beranda yang tidak lagi berderit pada senja hari.\n",
    "Sudah tiga tahun sejak terakhir kali ia pulang ke desa ini. Tiga tahun sejak ia memutuskan untuk mengejar karier di Jakarta dan meninggalkan ayahnya yang mulai renta. Telepon mingguan perlahan berubah menjadi dua mingguan, lalu bulanan, lalu sekadar pesan singkat di hari libur. \"Ayah baik-baik saja,\" begitu selalu jawab ayahnya. \"Kamu jangan khawatir. Fokus kerja.\" Dan Arum, dengan egonya yang keras kepala, mempercayai itu. Ia percaya ayahnya akan selalu ada—seperti langit, seperti gunung di kejauhan yang tidak pernah berpindah.\n",
    "Tapi langit pun bisa runtuh. Dan gunung bisa meletus.\n",
    "---\n",
    "Seminggu setelah pemakaman, Arum membereskan rumah. Tugas yang ia tunda-tunda, karena setiap sudak rumah adalah pisau yang mengiris ingatan. Ruang tamu dengan foto dirinya waktu wisuda. Dapur dengan gelas kopi favorit ayah yang masih tercuci bersih. Kamar tidur dengan selimut tipis yang masih menggantung di tepi ranjang, seolah ayah baru saja bangun dan sebentar lagi akan kembali.\n",
    "Di loteng, di antara kardus-kardus berdebu, Arum menemukan sebuah kotak sepatu tua yang diselotip rapat-rapat. Tanpa berpikir panjang, ia menyobek selotipnya dan membuka tutupnya.\n",
    "Isinya: amplop-amplop surat, lebih dari lima puluh, semuanya tidak pernah dikirim.\n",
    "Tangannya gemetar saat mengambil satu dari tumpukan paling atas. Amplop putih sederhana, alamat pengirim: nama Ibunya. Alamat tujuan: sebuah rumah di Jakarta. Ia membaca tanggal di sudut amplop: 15 Maret 2018—enam bulan setelah ibunya meninggal.\n",
    "Dengan hati berdebar, Arum membuka surat itu.\n",
    "\"Untuk Ibu,\" begitu surat itu dimulai. \"Hari ini aku membuat sayur asam. Rasanya tidak seenak buatanmu, tapi Arum memuji. Dia bilang, 'Pa, masakan Ayah enak.' Aku tersenyum, tapi di dalam hati aku menangis. Aku merindukanmu, Bu. Setiap hari. Tapi aku harus kuat untuk Arum.\"\n",
    "Air mata Arum jatuh, membasahi kertas lusuh itu.\n",
    "Ia membuka surat kedua. Tanggal 20 April 2018.\n",
    "\"Untuk Ibu, hari ini Arum lulus cum laude. Aku duduk di barisan ketiga, mataku mencari-cari wajahmu di antara kerumunan. Aku tahu kau tidak mungkin ada di sana, tapi hatiku tetap berharap. Saat Arum menerima ijazah, aku bertepuk tangan paling kencang. Aku harap kau bisa melihatnya dari sana.\"\n",
    "Surat demi surat, tahun demi tahun. Tanggal 12 Januari 2019: Arum dapat kerja pertama. 7 Agustus 2019: Arum pindah ke Jakarta. 25 Desember 2019: Natal pertama tanpa Ibu. 14 Maret 2020: pandemi mulai. Ayah menulis tentang rasa takutnya, tentang kecemasannya pada Arum yang jauh di kota.\n",
    "\"Untuk Ibu, aku khawatir pada Arum. Jakarta lockdown, dan dia di sana sendirian. Aku ingin menyuruhnya pulang, tapi aku takut mengganggu kariernya. Kau tahu bagaimana dia—keras kepala sepertiku. Tolong jaga dia dari sana, Bu.\"\n",
    "Arum menekan surat itu ke dadanya. Tangisnya pecah—bukan tangis haru, tapi tangis penyesalan yang dalam, yang selama seminggu ini ia tahan. Ayahnya ternyata menulis surat ke ibunya setiap bulan, bercerita tentang semua hal kecil: tentang bunga mawar yang mekar di halaman, tentang kucing liar yang sering mampir, tentang hujan deras yang mengguyur desa, tentang rasa sepi yang tidak pernah bisa ia ungkapkan secara langsung.\n",
    "Semua surat itu berakhir dengan kalimat yang sama:\n",
    "\"Aku sayang Arum. Maafkan aku jika aku tidak cukup menjadi ayah yang baik. Aku hanya ingin dia bahagia.\"\n",
    "---\n",
    "Malam itu, Arum duduk di beranda, di kursi goyang ayahnya. Langit gelap tanpa bintang—seperti malam tiga tahun lalu saat ia terakhir duduk di sini bersama ayah. Waktu itu ia sibuk dengan ponselnya, membalas email kantor, setengah mendengarkan cerita ayah tentang tetangga yang sakit-sakitan.\n",
    "\"Pa,\" bisiknya ke angin malam, suaranya serak, \"maafin aku. Maaf karena aku pikir akan selalu ada waktu. Maaf karena aku memilih Jakarta daripada Ayah. Maaf karena aku tidak membaca surat-surat ini saat Ayah masih ada.\"\n",
    "Angin malam berembus, menggoyangkan daun-daun jati di halaman. Dan untuk sesaat, Arum merasa mendengar suara ayahnya, bergaung lembut di telinganya: \"Tidak apa, Nak. Ayah bangga padamu. Ayah selalu bangga.\"\n",
    "Mungkin itu hanya imajinasi. Mungkin itu hanya harapan yang berbicara. Tapi untuk pertama kalinya sejak pemakaman, Arum merasa ada secercah hangat di dadanya—seperti lilin kecil yang menyala di tengah kegelapan.\n",
    "Ia memutuskan untuk menghabiskan satu bulan di desa. Akan ia urus semuanya: bunga mawar ayah, kucing liar yang setia menunggu di teras, rumah tua yang penuh kenangan. Dan satu per satu, ia akan membaca semua surat ayah, dari awal hingga akhir. Sebagai penyesalan, sebagai penghormatan, dan sebagai janji bahwa ia tidak akan lagi meninggalkan orang-orang yang ia cintai.\n",
    "---\n",
    "Keheningan malam dipecahkan oleh suara jangkrik dan lolongan anjing dari jauh. Arum memandang langit—dan di antara gumpalan awan hitam, ia melihat secercah cahaya bintang. Kecil, redup, tapi masih bertahan.\n",
    "Seperti cinta ayahnya. Seperti surat-surat yang tidak pernah terkirim. Seperti janji yang kini bersemayam di hatinya.\n",
    "Ia tidak akan menyia-nyiakan waktu lagi.\n",
    "Sebelum tidur, Arum mengambil sebuah buku kosong dan menulis di halaman pertamanya:\n",
    "\"Untuk Ayah... ini surat pertama dari seribu surat yang tidak akan pernah cukup panjang untuk mengungkapkan betapa aku merindukanmu. Tapi aku akan mencoba. Setiap hari, aku akan mencoba.\"\n",
    "Di luar, angin malam berembus lembut, membawa bisikan dedaunan dan janji esok yang baru. Di kejauhan, kilat menyambar di ufuk timur—pertanda hujan akan turun. Tapi untuk pertama kalinya, Arum tidak takut. Karena ia tahu, setelah hujan, akan ada pelangi.\n",
    "Dan di ujung pelangi itu, ayahnya sedang tersenyum.\n",
  ].join("\n"),
  wordCount: 845,
};
