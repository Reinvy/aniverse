/**
 * AniVerse Daily Webtoon Panel Outline — July 26, 2026
 * Based on: Chapter 1 "Senja di Ujung Pelangi"
 * Genre: Drama (Emotional)
 *
 * Panel descriptions for 5 key scenes from the chapter.
 * Each panel includes visual description, dialogue/text overlay,
 * and compositional notes for the AI art generator (Agent A3).
 */

export interface WebtoonPanel {
  id: string;
  title: string;
  imageUrl: string;
  dialogue: string;
  panelOrder: number;
  description: string;
  visualStyle: string;
  colorPalette: string;
  mood: string;
  chapterRef: string;
}

export const dailyWebtoonPanels: WebtoonPanel[] = [
  {
    id: "panel-20260726-01",
    title: "Kosong di Antara Doa",
    imageUrl: "/placeholder-webtoon/20260726/panel-01.svg",
    dialogue:
      "\"Aku baik-baik saja... Ayah pasti tidak mau aku bersedih.\"",
    panelOrder: 1,
    description:
      "Arum berdiri di antara deretan kursi lipat di pemakaman, mengenakan kebaya hitam. Wajahnya tenang, tersenyum tipis, tapi matanya kosong—kehilangan. Latar belakang memperlihatkan langit kelabu dan barisan makam di bawah pohon besar. Tangan kanannya menggenggam bunga mawar putih erat-erat. Di kejauhan, beberapa pelayat berdiri dengan payung hitam.",
    visualStyle:
      "Anime drama style, soft cel-shading with watercolor background, melancholic atmosphere",
    colorPalette:
      "Desaturated grays, muted blacks, soft white with hints of faded green from grass, overcast sky blue-gray",
    mood: "Sunyi, hampa, kesedihan yang tertahan — kehilangan yang belum bisa diterima",
    chapterRef: "Senja di Ujung Pelangi — Bab 1",
  },
  {
    id: "panel-20260726-02",
    title: "Kotak Surat Tua",
    imageUrl: "/placeholder-webtoon/20260726/panel-02.svg",
    dialogue:
      "\"Untuk Ibu... hari ini Arum lulus cum laude. Aku bangga padanya.\"",
    panelOrder: 2,
    description:
      "Close-up tangan Arum yang gemetar membuka kotak sepatu tua di loteng berdebu. Tumpukan amplop surat berserakan—lebih dari lima puluh. Cahaya jendela loteng menyinari salah satu surat yang terbuka, memperlihatkan tulisan tangan ayah yang rapi dan penuh cinta. Debu melayang di udara, menciptakan efek sinar matahari yang dramatis.",
    visualStyle:
      "Intimate close-up, warm cinematic lighting, dust particles catching light, nostalgic texture",
    colorPalette:
      "Warm sepia tones, faded paper beige, golden sunlight streaks, shadows in deep brown",
    mood: "Haru, penuh kejutan, nostalgia yang menusuk — penemuan yang mengubah segalanya",
    chapterRef: "Senja di Ujung Pelangi — Bab 1",
  },
  {
    id: "panel-20260726-03",
    title: "Air Mata di Beranda",
    imageUrl: "/placeholder-webtoon/20260726/panel-03.svg",
    dialogue:
      "\"Maafin aku, Pa. Maaf karena aku pikir akan selalu ada waktu.\"",
    panelOrder: 3,
    description:
      "Arum duduk di kursi goyang kayu di beranda rumah, di malam hari. Langit gelap tanpa bintang. Wajahnya basah oleh air mata, tangannya memegang setumpuk surat di pangkuannya. Halaman rumah yang gelap, dengan bayangan pohon jati yang bergoyang tertiup angin. Lampu beranda yang temaram menciptakan siluet dramatis.",
    visualStyle:
      "Nocturnal scene, dramatic shadow play, soft moonlight highlights, emotional character close-up",
    colorPalette:
      "Deep night blues, warm amber from porch light, silver-white moonlight, teardrop highlights in pale blue",
    mood: "Penyesalan mendalam, haru, terapi kesedihan — titik terendah menuju penerimaan",
    chapterRef: "Senja di Ujung Pelangi — Bab 1",
  },
  {
    id: "panel-20260726-04",
    title: "Bisikan Angin Malam",
    imageUrl: "/placeholder-webtoon/20260726/panel-04.svg",
    dialogue:
      "\"Tidak apa, Nak. Ayah bangga padamu. Ayah selalu bangga.\"",
    panelOrder: 4,
    description:
      "Panel transisi: Arum memejamkan mata di kursi goyang, dan di sekelilingnya muncul efek visual—partikel-partikel cahaya hangat yang melayang seperti kunang-kunang. Siluet transparan seorang pria tua (ayah) duduk di kursi di sebelahnya, tersenyum lembut. Ini adalah momen yang melambangkan bahwa Arum akhirnya bisa merasakan kehadiran ayahnya dalam kenangan dan cinta yang ditinggalkan. Gauzy, dreamlike atmosphere.",
    visualStyle:
      "Surreal dream sequence, soft glow effects, semi-transparent ghosting, warm atmospheric haze",
    colorPalette:
      "Warm golden particles, soft lavender transition, ethereal white glow, fading into warm peach",
    mood: "Magis, haru, penuh penghiburan — momen katarsis dan pelepasan",
    chapterRef: "Senja di Ujung Pelangi — Bab 1",
  },
  {
    id: "panel-20260726-05",
    title: "Pelangi Setelah Hujan",
    imageUrl: "/placeholder-webtoon/20260726/panel-05.svg",
    dialogue:
      "\"Untuk Ayah... ini surat pertama dari seribu surat yang tidak akan pernah cukup panjang.\"",
    panelOrder: 5,
    description:
      "Panel akhir: Arum duduk di meja kayu di kamar ayah, menulis di buku harian di pagi hari. Jendela terbuka, dan sinar matahari masuk bersama semburat pelangi tipis yang memantul dari kaca prismatik. Di atas meja, foto ayah dalam bingkai tersenyum. Di halaman buku yang ditulis Arum, terbaca kata-kata: 'Untuk Ayah, dengan cinta.' Suasana hangat dan penuh harapan baru.",
    visualStyle:
      "Warm morning scene, gentle sunlight, hopeful composition, soft textures and cozy atmosphere",
    colorPalette:
      "Morning gold, warm wood browns, soft green from outdoor foliage, prismatic rainbow highlights, crisp white paper",
    mood: "Pengharapan, penerimaan, kedamaian — awal babak baru",
    chapterRef: "Senja di Ujung Pelangi — Bab 1",
  },
];

/**
 * Metadata for the daily webtoon series.
 */
export const dailyWebtoonMeta = {
  date: "2026-07-26",
  seriesTitle: "Senja di Ujung Pelangi",
  episodeNumber: 1,
  totalPanels: 5,
  chapterRef: "chapter-20260726",
  genre: "Drama" as const,
  artDirection: {
    style: "Anime drama style, soft cel-shading with watercolor backgrounds, intimate character focus",
    lineart: "Clean, slightly textured with emotional expression emphasis, softer edges for dramatic scenes",
    shading: "Soft cel-shading with warm ambient light, dramatic shadow play for night scenes",
    composition: "Cinematic panels balancing close-up emotional beats with atmospheric establishing shots",
  },
  nsfwFilter: "PASS — all panels are SFW, suitable for all ages. Emotional drama, no violent or suggestive content.",
};
