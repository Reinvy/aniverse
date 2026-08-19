/**
 * AniVerse Daily Webtoon Panel Outline — July 27, 2026
 * Based on: Chapter 1 "Secangkir Kopi di Senin Pagi"
 * Genre: Romance/Slice-of-life
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
    id: "panel-20260727-01",
    title: "Kopi Pertama yang Diingat",
    imageUrl: "/placeholder-webtoon/20260727/panel-01.svg",
    dialogue:
      "\"Tiga minggu berturut-turut, Senin pagi selalu kopi hitam tanpa gula. Aku mulai hafal.\"",
    panelOrder: 1,
    description:
      "Interior kedai kopi hangat 'Secangkir Senja' di pagi hari yang hujan. Raka duduk di meja kayu dekat jendela, laptop terbuka di depannya, sedang menatap ke atas dengan ekspresi sedikit tersentak. Luna berdiri di sampingnya, mengenakan celemek coklat tua, membawa cangkir kopi putih mengepul. Rambutnya diikat ekor kuda rendah. Di luar jendela, hujan deras mengguyur jalanan kota Malang yang basah. Suasana temaram dengan lampu kuning hangat dari lampu gantung.",
    visualStyle:
      "Warm anime slice-of-life art, soft cel-shading, cozy cafe atmosphere, gentle lighting from overhead lamps",
    colorPalette:
      "Warm amber, coffee brown, cream white, soft gray from rainy window, dark wood table tones, hint of green from indoor plants",
    mood: "Hangat, nyaman, sedikit canggung — momen pertama dua orang saling memperhatikan",
    chapterRef: "Secangkir Kopi di Senin Pagi — Bab 1",
  },
  {
    id: "panel-20260727-02",
    title: "Bintang Kecil di Sudut Mata",
    imageUrl: "/placeholder-webtoon/20260727/panel-02.svg",
    dialogue:
      "\"Tahi lalat ini? Aku menyebutnya bintang kecil. Yang paling aku suka dari diriku sendiri.\"",
    panelOrder: 2,
    description:
      "Close-up wajah Luna dari samping, tersenyum sambil menunjuk ke sudut matanya. Cahaya pagi yang lembut dari jendela menyinari wajahnya, membuat tahi lalat kecil di sudut matanya terlihat jelas. Latar belakang di luar fokus — rak buku dan etalase kue — menciptakan kedalaman. Raka terlihat samar di sisi kiri bingkai, memperhatikan dengan ekspresi penasaran dan kagum.",
    visualStyle:
      "Intimate close-up portrait, soft bokeh background, warm rim lighting, gentle skin tones, focus on expression",
    colorPalette:
      "Soft peach skin tones, warm gold highlights, cream background, chestnut brown eyes, subtle pink on cheeks",
    mood: "Lembut, intim, penuh kehangatan — momen ketika ketertarikan mulai tumbuh",
    chapterRef: "Secangkir Kopi di Senin Pagi — Bab 1",
  },
  {
    id: "panel-20260727-03",
    title: "Senin yang Sepi",
    imageUrl: "/placeholder-webtoon/20260727/panel-03.svg",
    dialogue:
      "\"Kopi ini... terlalu pahit. Atau mungkin hati Raka yang sedang tidak enak.\"",
    panelOrder: 3,
    description:
      "Raka duduk sendirian di meja yang sama, tapi suasana berbeda. Kedai terasa lebih gelap dan hampa. Ia memegang cangkir kopi yang disajikan Pak Anton — bukan Luna — dengan ekspresi lesu dan sedikit kecewa. Latar kedai yang biasanya hangat kini terasa dingin dan abu-abu. Hujan masih turun di luar jendela, lebih deras dari sebelumnya. Layar laptop di depannya hanya menampilkan kursor yang berkedip-kedip tanpa ada kode yang diketik.",
    visualStyle:
      "Desaturated color palette, melancholic atmosphere, lonely composition, empty negative space emphasizing solitude",
    colorPalette:
      "Muted grays, desaturated brown, pale blue-gray from rainy window, dim lighting, faded amber",
    mood: "Sepi, hampa, merindukan — ketika ketidakhadiran seseorang terasa begitu nyata",
    chapterRef: "Secangkir Kopi di Senin Pagi — Bab 1",
  },
  {
    id: "panel-20260727-04",
    title: "Senin Pagi Spesial",
    imageUrl: "/placeholder-webtoon/20260727/panel-04.svg",
    dialogue:
      "\"Kupanggil ini 'Senin Pagi'. Karena Senin pagi ternyata bisa jadi indah kalau kau punya alasan untuk bangun.\"",
    panelOrder: 4,
    description:
      "Luna meletakkan cangkir kopi spesial di depan Raka — kopi hitam dengan taburan kayu manis dan foam susu berbentuk hati di atasnya. Keduanya saling bertatapan. Senyum Luna merekah hangat, sementara Raka terlihat tersipu. Latar kedai terang dan cerah, sinar matahari masuk dari jendela yang kini bersih dari hujan. Background memperlihatkan detail kedai yang nyaman: rak buku, tanaman gantung, dan lukisan pemandangan kecil di dinding.",
    visualStyle:
      "Warm morning scene, bright atmosphere, romantic composition, soft highlights, heart-shaped latte art as focal point",
    colorPalette:
      "Morning sunlight gold, warm wood tones, cream white foam, cinnamon brown, soft green foliage, bright white accents",
    mood: "Bahagia, penuh harapan, romantis — momen ketika perasaan mulai diakui",
    chapterRef: "Secangkir Kopi di Senin Pagi — Bab 1",
  },
  {
    id: "panel-20260727-05",
    title: "Ya, Selama Ini Aku Menunggu",
    imageUrl: "/placeholder-webtoon/20260727/panel-05.svg",
    dialogue:
      "\"Aku pikir kamu tidak akan pernah bertanya.\" — tertulis di cangkir kopi.",
    panelOrder: 5,
    description:
      "Panel akhir yang hangat: Raka dan Luna duduk berhadapan di meja yang sama, kedai sepi dan hanya mereka berdua. Di tangan Raka, sebuah cangkir kopi putih dengan tulisan tangan 'Aku pikir kamu tidak akan pernah bertanya.' Senyum Raka dan Luna sama-sama merekah, wajah mereka berseri. Di luar jendela, matahari bersinar terang setelah hujan reda — pelangi tipis terlihat di langit. Latar kedai yang nyaman dengan tanaman hijau dan rak buku menciptakan suasana yang sempurna. Adegan ini menangkap momen ketika dua hati akhirnya menemukan jalannya satu sama lain.",
    visualStyle:
      "Cinematic wide shot, warm golden hour lighting, hopeful composition, cozy atmosphere, subtle romantic framing",
    colorPalette:
      "Golden sunset tones, warm peach, soft lavender shadows, bright white and cream, rainbow prism highlights on window",
    mood: "Pengharapan, kebahagiaan, cinta yang baru mekar — awal dari petualangan baru bersama",
    chapterRef: "Secangkir Kopi di Senin Pagi — Bab 1",
  },
];

/**
 * Metadata for the daily webtoon series.
 */
export const dailyWebtoonMeta = {
  date: "2026-07-27",
  seriesTitle: "Secangkir Kopi di Senin Pagi",
  episodeNumber: 1,
  totalPanels: 5,
  chapterRef: "chapter-20260727",
  genre: "Romance" as const,
  artDirection: {
    style: "Anime slice-of-life style, warm color palette with soft cel-shading, cozy indoor compositions with natural lighting",
    lineart: "Clean, gentle curves with soft edges, expressive character faces emphasizing subtle emotions",
    shading: "Soft cel-shading with warm ambient light, gentle rim lighting for romantic scenes",
    composition: "Balance between intimate close-ups and warm establishing shots, cinematic framing with depth of field",
  },
  nsfwFilter: "PASS — all panels are SFW, suitable for all ages. Pure romance and slice-of-life, no suggestive content.",
};
