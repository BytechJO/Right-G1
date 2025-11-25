import Pg22_1_1_AdultLady from "../../assets/unit5/sounds/Pg40_1.2_Adult Lady.mp3";
import Pg22_1_2_AdultLady from "../../assets/unit5/sounds/Pg40_1.3_Adult Lady.mp3";
import Pg22_1_3_AdultLady from "../../assets/unit5/sounds/Pg40_1.4_Adult Lady.mp3";
import Pg22_1_4_AdultLady from "../../assets/unit5/sounds/Pg40_1.5_Adult Lady.mp3";
import img1 from "../../assets/unit5/imgs/G.svg";
import img2 from "../../assets/unit5/imgs/girl.svg";
import img3 from "../../assets/unit5/imgs/green.svg";
import img4 from "../../assets/unit5/imgs/garden.svg";
import FourImagesWithAudio from "../FourImagesWithAudio";
import longAudio from "../../assets/unit5/sounds/Pg40_1.1_Adult Lady.mp3";
import Rabbit from "../../assets/img_unit2/imgs/Rabbit.svg";
const Unit5_Page1_Read = () => {
  const imageSounds = [
    null, // الصورة الأولى الكبيرة (إن ما بدك صوت إلها)
    new Audio(Pg22_1_1_AdultLady),
    new Audio(Pg22_1_2_AdultLady),
    new Audio(Pg22_1_3_AdultLady),
    new Audio(Pg22_1_4_AdultLady),
  ];
  return (
    <>

         <FourImagesWithAudio
        images={[Rabbit, img1, img2, img3, img4]}
        audioSrc={longAudio}
        checkpoints={[0, 3.95, 5.11,6.05, 7.00]}
        popupOpen={true}
        titleQ={"Listen and read along."}
        audioArr={imageSounds}
      />
    </>
  );
};

export default Unit5_Page1_Read;
