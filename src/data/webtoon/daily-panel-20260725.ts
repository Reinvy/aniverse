/**
 * AniVerse Daily Webtoon Panel Outline — July 25, 2026
 * Based on: Chapter 1 "Kode dalam Kristal"
 * Genre: Sci-Fi/Fantasy
 *
 * Panel descriptions for 4 key scenes from the chapter.
 * Each panel includes visual description, dialogue/text overlay,
 * and compositional notes for the AI art generator (Agent A3).
 * Visual style aligns with A3's Vaporwave + Digital Neon themes.
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
    id: "panel-20260725-01",
    title: "Kota Aurora",
    imageUrl: "/placeholder-webtoon/20260725/panel-01.svg",
    dialogue: "\"Selamat datang di Kota Aurora — keajaiban abad ke-22.\"",
    panelOrder: 1,
    description:
      "Establishing shot Kota Aurora: megalopolis terapung raksasa di atas Samudra Pasifik dengan gedung pencakar langit futuristik menjulang ke awan. Langit senja jingga-ungu dengan grid holografik berwarna neon biru dan merah muda membentang di atas kota. Pesawat terbang kecil melintas di antara gedung-gedung. Di sudut bawah, Maya duduk di balkon apartemen mungilnya, memandangi kota dengan ekspresi muram.",
    visualStyle:
      "Vaporwave anime, wide establishing shot, Science SARU cel-shading aesthetic, retro-future cityscape dengan CRT scanline overlay tipis",
    colorPalette:
      "Digital Neon — cyan (#00FFFF), hot pink (#FF1493), deep purple (#2D1B69), dengan aksen gold (#FFD700) dari lampu kota",
    mood: "Takjub sekaligus sepi — keindahan futuristik yang hampa",
    chapterRef: "Kode dalam Kristal — Bab 1",
  },
  {
    id: "panel-20260725-02",
    title: "Kristal di Bawah Kota",
    imageUrl: "/placeholder-webtoon/20260725/panel-02.svg",
    dialogue: "\"Akhirnya... seorang Pembaca Kode datang.\"",
    panelOrder: 2,
    description:
      "Maya berdiri di ruang server bawah tanah lantai -127. Di tengah ruangan, server berbentuk kubus raksasa tertutup kristal transparan bercahaya — material asing yang memancarkan spektrum biru-keunguan. Pantulan cahaya kristal menerangi wajah Maya yang terpukau. Di permukaan kristal, pola melingkar berdenyut seperti gelombang radar. Dinding beton retak dihiasi lumut biru kehijauan bercahaya, menciptakan kontras antara teknologi tua dan magis.",
    visualStyle:
      "Anime sci-fi horror ringan, chiaroscuro lighting dengan sumber cahaya dari kristal, tekstur VHS grain halus",
    colorPalette:
      "Cyan gelap (#008B8B), electric purple (#BF00FF), luminescent teal (#00FFCC), dengan bayangan hitam pekat",
    mood: "Mistis, mencekam, penuh misteri — penemuan yang mengubah segalanya",
    chapterRef: "Kode dalam Kristal — Bab 1",
  },
  {
    id: "panel-20260725-03",
    title: "Alam Matrix Purba",
    imageUrl: "/placeholder-webtoon/20260725/panel-03.svg",
    dialogue: "\"Kau berada di Alam Matrix Purba. Aku Echo — arsitek pertama internet.\"",
    panelOrder: 3,
    description:
      "Maya berdiri di padang rumput keperakan tak berujung di bawah langit ungu dengan dua rembulan. Partikel-partikel kode heksadesimal melayang di udara seperti kunang-kunang bercahaya (#0F0 dan #00FFFF). Di depannya, Echo — sosok wanita setinggi tiga meter dengan tubuh tersusun dari untaian cahaya biru keunguan yang mengalir seperti air — melayang dengan anggun. Wajah Echo abstrak, berubah antara figur manusia dan pola geometris rumit. Di latar belakang, pepohonan digital berbentuk fraktal menjulang.",
    visualStyle:
      "Psychedelic fantasy digital art, pseudo-3D depth, cel-shading with glowing line art, sedikit pengaruh Art Nouveau pada lekukan Echo",
    colorPalette:
      "Vaporwave sunset — magenta (#FF00FF), cyan (#00FFFF), lavender (#E6E6FA), silver (#C0C0C0), dengan aksen matrix green (#00FF41)",
    mood: "Takjub, spiritual, transenden — pertemuan antara manusia dan kesadaran purba",
    chapterRef: "Kode dalam Kristal — Bab 1",
  },
  {
    id: "panel-20260725-04",
    title: "Pertandingan Dimulai",
    imageUrl: "/placeholder-webtoon/20260725/panel-04.svg",
    dialogue: "\"Jadilah Penyair yang menulis ulang takdir, Maya.\"",
    panelOrder: 4,
    description:
      "Split panel: (kiri) Maya berlari di koridor server menuju terminal utama, rambutnya berkibar, matanya menyala dengan tekad — garis-garis kode bercahaya digital terlihat di bawah kulit tangannya. (kanan) Visualisasi jaringan quantum Kota Aurora sebagai lautan data raksasa berbentuk seperti pohon dunia digital, dengan akar menjalar ke kristal di bawah. Di kedalaman jaringan, sesosok bayangan api merah (Koruptor) mendekati pusat dengan kecepatan tinggi. Di atas split panel, tulisan kode-kode Bahasa Purba melayang seperti mantra.",
    visualStyle:
      "Dynamic action composition, split-panel cinematic, high contrast cel-shading dengan digital glitch effects halus di tepi panel",
    colorPalette:
      "Kiri: warm amber (#FFBF00) dan coral (#FF6B6B) — aksi dan urgensi. Kanan: deep navy (#0A0A2E) dengan crimson (#DC143C) — ancaman. Kode: gold (#FFD700) dan cyan",
    mood: "Urgen, epik, antisipatif — klimaks menjelang pertempuran",
    chapterRef: "Kode dalam Kristal — Bab 1",
  },
];

export const dailyWebtoonMeta = {
  date: "2026-07-25",
  seriesTitle: "Kode dalam Kristal",
  episodeNumber: 1,
  totalPanels: 4,
  chapterRef: "chapter-20260725",
  genre: "Sci-Fi/Fantasy" as const,
  artDirection: {
    style: "Vaporwave anime cel-shaded with digital neon accents, Science SARU aesthetic with retro VHS grain overlay",
    lineart: "Clean digital lines with slight CRT phosphor glow on edges",
    shading: "High-contrast cel-shading with luminous digital aura effects, pastel goth shadow tones",
    composition: "Cinematic wide shots for world-building, intimate close-ups for emotional beats, digital glitch transitions between reality and Matrix",
  },
  nsfwFilter: "PASS — all panels are SFW, suitable for all ages",
};
