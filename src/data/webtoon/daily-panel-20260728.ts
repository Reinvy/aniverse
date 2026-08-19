/**
 * AniVerse Daily Webtoon Panel Outline — July 28, 2026
 * Based on: Chapter 1 "Gerbang di Lorong Belakang Sekolah"
 * Genre: Fantasy/Isekai
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
    id: "panel-20260728-01",
    title: "Lingkaran Cahaya di Lorong Belakang",
    imageUrl: "/placeholder-webtoon/20260728/panel-01.svg",
    dialogue:
      "\"Ini... ini bukan efek knalpot motor, kan?\"",
    panelOrder: 1,
    description:
      "Lorong belakang sekolah yang sepi — tembok beton retak, rumput liar setinggi lutut, dan di ujung lorong, sebuah lingkaran cahaya keemasan melayang di atas tanah. Arya, seorang remaja SMA dengan seragam putih abu-abu dan rambut acak-acakan, berdiri tercengang beberapa meter dari lingkaran itu. Komik terjatuh dari tangannya. Lingkaran cahaya memancarkan kilauan emas yang menerangi wajah Arya dengan ekspresi takjub campur takut. Di dalam lingkaran, samar-samar terlihat pemandangan dunia lain: langit ungu dan pepohonan kristal.",
    visualStyle:
      "Anime fantasy style with detailed background, light effects with golden glow, contrast between mundane school and magical portal",
    colorPalette:
      "Muted school corridor grays and browns contrasting with vibrant portal gold, hints of purple and silver from Ardheim visible through portal",
    mood: "Takjub, misterius, transisi — momen ketika dunia biasa bersinggungan dengan keajaiban",
    chapterRef: "Gerbang di Lorong Belakang Sekolah — Bab 1",
  },
  {
    id: "panel-20260728-02",
    title: "Pertemuan dengan Elara",
    imageUrl: "/placeholder-webtoon/20260728/panel-02.svg",
    dialogue:
      "\"Kau manusia dari dunia lain. Kau panggilan terakhir kami.\"",
    panelOrder: 2,
    description:
      "Arya duduk di rumput biru keperakan di bawah langit ungu dengan dua bulan — satu emas, satu perak. Di depannya berdiri Elara, seorang elf wanita dengan rambut panjang putih perak, telinga runcing, dan mata biru pucat. Wajahnya kotor dan lelah, pakaiannya compang-camping, tapi posturnya tegap. Di tangannya, tongkat kayu retak yang nyaris patah. Di latar belakang, hutan kristal bersinar dengan cahaya perak redup — beberapa kristal tampak suram dan retak, pertanda sihir yang memudar.",
    visualStyle:
      "Epic fantasy isekai art, vibrant alien landscape, detailed character design, contrast between weary elf and bewildered human teen",
    colorPalette:
      "Twilight purple sky, silver and gold moonlight, bioluminescent blue-silver crystals, warm skin tones of Arya against ethereal pale elf",
    mood: "Kekaguman, urgensi, beban tak terduga — pahlawan yang tidak pernah diminta",
    chapterRef: "Gerbang di Lorong Belakang Sekolah — Bab 1",
  },
  {
    id: "panel-20260728-03",
    title: "Pencabik Kehampaan",
    imageUrl: "/placeholder-webtoon/20260728/panel-03.svg",
    dialogue:
      "\"Hanya kau yang bisa menggunakannya. Karena kau berasal dari dunia tanpa sihir.\"",
    panelOrder: 3,
    description:
      "Close-up tangan Arya yang menerima belati perak Pencabik Kehampaan. Belati itu kecil namun indah — bilahnya berkilau perak dengan ukiran rune yang bersinar redup, gagangnya terbungkus kulit hitam dengan paku perak. Tangan Arya yang masih muda dan sedikit gemetar kontras dengan kegunaan senjata itu. Di latar belakang buram, Elara menatap dengan serius. Cahaya hangat dari kristal di sekitar mereka menciptakan bokeh perak dan biru.",
    visualStyle:
      "Intimate close-up shot, detailed weapon design, dramatic lighting, focus on hands and the artifact, shallow depth of field",
    colorPalette:
      "Silver and chrome from the blade, deep black of the hilt, glowing cyan rune carvings, soft warm skin tones, blurred cool blue background",
    mood: "Khidmat, penuh tanggung jawab — senjata yang membawa takdir seluruh dunia",
    chapterRef: "Gerbang di Lorong Belakang Sekolah — Bab 1",
  },
  {
    id: "panel-20260728-04",
    title: "Menara Tak Berujung",
    imageUrl: "/placeholder-webtoon/20260728/panel-04.svg",
    dialogue:
      "\"Aku tidak tahu apa yang harus aku lakukan.\" — \"Keberanian bukan tentang tidak takut. Keberanian adalah ketika kau takut setengah mati tapi tetap melangkah maju.\"",
    panelOrder: 4,
    description:
      "Wide shot epik: Arya dan Elara berdiri di kaki Menara Tak Berujung saat fajar magenta. Menara itu menjulang dari obsidian hitam, sangat tinggi hingga menembus awan, dengan ukiran naga raksasa yang melingkar di seluruh permukaannya. Di sekeliling menara, kabut hitam pekat berputar lambat seperti ular raksasa. Arya terlihat kecil di samping menara, memegang belatinya, wajahnya menunjukkan ketakutan dan tekad. Elara berdiri di belakangnya, satu tangan terangkat, melafalkan mantra yang membuat lapisan pelindung tembus pandang melingkupi Arya.",
    visualStyle:
      "Cinematic wide composition with dramatic scale contrast, towering dark fantasy architecture, magical particle effects, sunrise gradient sky",
    colorPalette:
      "Obsidian black, deep purple shadows, magenta-to-gold sunrise gradient, ethereal blue shield spell highlights, silver reflections on blade",
    mood: "Heroik, mencekam, epik — momen sebelum perjalanan terbesar dimulai",
    chapterRef: "Gerbang di Lorong Belakang Sekolah — Bab 1",
  },
  {
    id: "panel-20260728-05",
    title: "Langkah Pertama ke Dalam Kegelapan",
    imageUrl: "/placeholder-webtoon/20260728/panel-05.svg",
    dialogue:
      "\"Selamat jalan, Pahlawan dari dunia lain. Semoga Kristal Aether menerangi jalanmu.\"",
    panelOrder: 5,
    description:
      "Shot dari belakang: Arya berdiri di ambang pintu Menara Tak Berujung yang terbuka, silhouette-nya diterangi dari dalam oleh cahaya kristal biru. Pintu menara adalah lengkungan batu besar dengan ukiran naga — matanya seolah menyala merah. Arya melangkah ke dalam kegelapan, posturnya tegang tapi teguh. Di luar, Elara digambarkan dari kejauhan, kecil dan sendiri di bawah dua bulan. Komposisinya menekankan perpisahan dan perjalanan sendirian yang akan ditempuh Arya. Panel split tipis — di bagian bawah, scene kembali ke lorong belakang sekolah tempat komik Arya tergeletak terbuka di halaman terakhir.",
    visualStyle:
      "Dramatic backlighting, silhouette composition, split-scene storytelling, atmospheric depth with contrasting worlds",
    colorPalette:
      "Deep blacks and dark blues inside the tower, ethereal cyan crystal glow, warm silhouette rim light, school corridor in muted sepia for contrast",
    mood: "Heroik namun sendirian, mencekam tapi penuh harapan — awal petualangan yang sesungguhnya",
    chapterRef: "Gerbang di Lorong Belakang Sekolah — Bab 1",
  },
];

/**
 * Metadata for the daily webtoon series.
 */
export const dailyWebtoonMeta = {
  date: "2026-07-28",
  seriesTitle: "Gerbang di Lorong Belakang Sekolah",
  episodeNumber: 1,
  totalPanels: 5,
  chapterRef: "chapter-20260728",
  genre: "Fantasy" as const,
  artDirection: {
    style: "Japanese fantasy isekai anime style with vibrant otherworldly palette, detailed magical environments, and dynamic cinematic compositions",
    lineart: "Clean lines with occasional brush strokes for dramatic scenes, detailed character expressions blending awe and determination",
    shading: "Layered cel-shading with glowing light effects for magic, dramatic contrast between mundane school and fantasy world lighting",
    composition: "Wide cinematic landscapes for Ardheim scenes, intimate close-ups for emotional beats, vertical webtoon format optimized for mobile scrolling",
  },
  nsfwFilter: "PASS — all panels are SFW, fantasy adventure with no suggestive or violent content beyond fantasy combat themes suitable for teens+",
};
