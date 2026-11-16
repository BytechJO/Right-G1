import PosterMain from "../PostersVocabPages/Unit1/Unit1_PosterMain";
import { posterData } from "./PosterData";

export const postersVocabPages = (openPopup) =>
  posterData.map((item, index) => {
    // 📌 إذا كانت صفحة غلاف
    if (item.type === "cover") {
      return (
        <div key={index}>
          <img src={item.image} alt="cover" />
        </div>
      );
    }

    return <PosterMain key={item.unit} data={item} openPopup={openPopup} />;
  });
