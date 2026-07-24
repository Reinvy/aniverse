/**
 * AniVerse Daily Webtoon Panel Outline — July 24, 2026
 * Based on: Chapter 1 "Gerbang di Antara Dua Dunia"
 * Genre: Fantasy
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
    id: "panel-20260724-01",
    title: "Lukisan yang Hidup",
    imageUrl: "/placeholder-webtoon/20260724/panel-01.svg",
    dialogue: "\"Tolong kami, Raka...\"",
    panelOrder: 1,
    description:
      "Raka terbangun di balkon kosnya di malam hujan. Kanvas di depannya tiba-tiba memancarkan cahaya keperakan. Siluet gadis bersayap kupu-kupu di lukisan itu mulai bergerak, dan hutan di latar belakang berdenyut seperti jantung berdetak. Raka terpaku, kuas jatuh dari tangannya. Cahaya menyelimuti kamar.",
    visualStyle:
      "Anime fantasy, cel-shaded with watercolor accents, Ghibli-inspired atmosphere",
    colorPalette:
      "Dusty pastels — muted lavender, sage green, warm earthy browns, with silver-white magical glow",
    mood: "Mistis, transisi, magis — dari realitas ke fantasi",
    chapterRef: "Gerbang di Antara Dua Dunia — Bab 1",
  },
  {
    id: "panel-20260724-02",
    title: "Dunia Ungu",
    imageUrl: "/placeholder-webtoon/20260724/panel-02.svg",
    dialogue:
      "\"Selamat datang... Pelukis Takdir.\"",
    panelOrder: 2,
    description:
      "Raka terbaring di hamparan lumut biru kehijauan. Langit ungu dengan dua rembulan bersinar di atasnya. Partikel cahaya melayang di udara seperti kunang-kunang. Pola bercahaya perak menghiasi tangannya. Di depannya, Laras — gadis bersayap kupu-kupu — berdiri dengan senyum tipis.",
    visualStyle:
      "Fantasy landscape, wide establishing shot, soft glow effects",
    colorPalette:
      "Deep purple sky, luminous teal-blue moss, silver-white magical particles, warm peach accents on character",
    mood: "Takjub, asing, penuh misteri — awal petualangan",
    chapterRef: "Gerbang di Antara Dua Dunia — Bab 1",
  },
  {
    id: "panel-20260724-03",
    title: "Kuas Takdir",
    imageUrl: "/placeholder-webtoon/20260724/panel-03.svg",
    dialogue:
      "\"Setiap goresan memiliki harga. Tapi di dunia ini, apa yang kau bayangkan bisa menjadi nyata.\"",
    panelOrder: 3,
    description:
      "Close-up tangan Raka yang meraih Kuas Takdir — sebuah kuas dengan gagang kayu berukir rumit dan ujung rambut bercahaya seperti bintang. Saat jari-jarinya menyentuh gagang, pola perak di tangannya menyala terang. Latar belakang menampilkan Laras yang memperhatikan dengan tatapan penuh harap, sementara di kejauhan api merah berkobar di ufuk.",
    visualStyle:
      "Dramatic close-up, magical transformation effect, glowing lines",
    colorPalette:
      "Silver-white magical glow, warm amber on the brush, dark purple background with crimson horizon",
    mood: "Epik, penuh determinasi — momen takdir",
    chapterRef: "Gerbang di Antara Dua Dunia — Bab 1",
  },
  {
    id: "panel-20260724-04",
    title: "Vallenwood",
    imageUrl: "/placeholder-webtoon/20260724/panel-04.svg",
    dialogue:
      "\"Kami sudah lama menanti kedatanganmu, Pelukis Takdir.\"",
    panelOrder: 4,
    description:
      "Raka dan Laras tiba di Vallenwood — pemukiman fantasi dengan rumah-rumah kubah dari batu putih berkilau. Warga desa yang beragam (manusia bertelinga runcing, makhluk bersayap capung, humanoid batu) memandang Raka dengan harap. Tetua Eldric berjubah putih menyambut mereka. Kristal raksasa memancarkan cahaya merah muda di lembah.",
    visualStyle:
      "Fantasy village, wide shot, diverse fantasy races, peaceful yet wary atmosphere",
    colorPalette:
      "Warm peach and pink from crystal reflections, white stone buildings, earthy browns, with subtle magical highlights",
    mood: "Haru, penuh harapan, sedikit tegang",
    chapterRef: "Gerbang di Antara Dua Dunia — Bab 1",
  },
  {
    id: "panel-20260724-05",
    title: "Fajar Pertempuran",
    imageUrl: "/placeholder-webtoon/20260724/panel-05.svg",
    dialogue:
      "\"Istirahatlah, Pelukis Takdir. Besok, kita hadapi Aurum.\"",
    panelOrder: 5,
    description:
      "Panel akhir: Raka berdiri di tepi desa, menatap langit ungu yang berubah jingga. Di tangannya, liontin kristal pemberian Eldric bersinar lembut. Di kejauhan, kilatan api merah terus menyala — ancaman Aurum the Eternal. Laras berdiri di sampingnya, sayap keperakan terkembang. Komposisi left-to-right: Raka dan Laras di kiri, ufuk api di kanan, menandakan perjalanan ke medan perang.",
    visualStyle:
      "Cinematic wide shot, dramatic lighting, hopeful yet ominous tone",
    colorPalette:
      "Twilight orange-purple gradient, silver-white highlights, distant crimson flames, cool blue shadows",
    mood: "Tegang, antisipatif, penuh tekad — akhir Bab 1",
    chapterRef: "Gerbang di Antara Dua Dunia — Bab 1",
  },
];

/**
 * Metadata for the daily webtoon series.
 */
export const dailyWebtoonMeta = {
  date: "2026-07-24",
  seriesTitle: "Gerbang di Antara Dua Dunia",
  episodeNumber: 1,
  totalPanels: 5,
  chapterRef: "chapter-20260724",
  genre: "Fantasy" as const,
  artDirection: {
    style: "Anime fantasy cel-shaded with watercolor accents, Ghibli-inspired backgrounds",
    lineart: "Clean, slightly textured with soft brush edges",
    shading: "Soft cel-shading with luminous magical glow effects",
    composition: "Cinematic panels with character focus and atmospheric backgrounds",
  },
  nsfwFilter: "PASS — all panels are SFW, suitable for all ages",
};
