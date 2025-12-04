// استيراد كل الصور من المجلد
const images = import.meta.glob("../../assets/Right Grammar Poster/*.png", {
  eager: true,
});

// استيراد كل الأصوات من نفس المجلد
const audios = import.meta.glob("./*.mp3", { eager: true });

// تحويلها إلى مصفوفة [{img, audio}]
export const posterPages = Object.keys(images)
  .sort((a, b) => {
    const numA = Number(a.match(/(\d+)\.png$/)[1]);
    const numB = Number(b.match(/(\d+)\.png$/)[1]);
    return numA - numB;
  })
  .map((key) => {
    const number = key.match(/(\d+)\.png$/)[1];
    const audioKey = Object.keys(audios).find((a) => a.includes(number));

    return {
      img: images[key].default,
      audio: audioKey ? audios[audioKey].default : null,
    };
  });
