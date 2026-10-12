import FindQuestion from "../../FindQuestion";
import findImg from "../../../assets/unit9/imgs/G1_U9 _Pg_76-77 copy.jpg";
import answerHighlight from "../../../assets/unit9/imgs/U8P76 highlight.svg";
import carrotsAudio from "../../../assets/unit9/sound/Page 76/carrots.mp3";

const targetArea = {
  x1: 17.94,
  y1: 37.59,
  x2: 24.99,
  y2: 44.27,
};

const Unit9_Page1_find = () => (
  <FindQuestion
    title="Can you find the carrots?"
    subtitle="Scan the whole farm scene, then tap the carrots."
    image={findImg}
    imageAlt="A busy farm scene with a barn, animals, plants, and carrots growing in the garden."
    targetName="carrots"
    targetArea={targetArea}
    answerHighlight={answerHighlight}
    targetAudio={carrotsAudio}
    imageHeight="75vh"
    highlightTop="35%"
    highlightLeft="17%"
    highlightHeight="11%"
    targetAriaLabel="Select the carrots"
    pointerSelectedMessage="A point in the farm picture was selected. Use Check Answer to check it."
    keyboardSelectedMessage="Carrots selected. Use Check Answer to check your answer."
    correctAnnouncement="Correct. You found the carrots."
    correctAlertMessage="You found the carrots! 🏆"
    wrongAnnouncement="Those are not the carrots. Try again."
    wrongAlertMessage="Those are not the carrots. Try again!"
    resetAnnouncement="Activity reset. Find the carrots in the farm picture."
    showAnswerAnnouncement="The carrots are highlighted."
  />
);

export default Unit9_Page1_find;
