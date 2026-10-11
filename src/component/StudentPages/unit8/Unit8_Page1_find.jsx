import React from "react";
import find_img from "../../../assets/unit8/imgs/G1_U8 _Pg_64-65 copy.jpg";
import MySVG from "../../../assets/unit8/imgs/U8P64 highlight.svg";
import targetAudio from "../../../assets/unit8/sound/Page 64/Jack’s ear.mp3";
import FindQuestion from "../../FindQuestion";

const targetArea = {
  x1: 34.58,
  y1: 23.2,
  x2: 36.64,
  y2: 26.92,
};

const Unit8_Page1_find = () => {
  return (
    <FindQuestion
      title="I need your help. Can you help me find Jack's ear in the picture?"
      subtitle="Look closely at Jack, then tap his ear."
      image={find_img}
      imageAlt="An outdoor soccer scene with children and characters. Find Jack’s ear in the picture."
      targetName="Jack’s ear"
      targetArea={targetArea}
      answerHighlight={MySVG}
      targetAudio={targetAudio}
      imageHeight="75vh"
      highlightTop="23.5%"
      highlightLeft="35%"
      highlightHeight="4%"
      targetAriaLabel="Select Jack’s ear"
      pointerSelectedMessage="A point in the picture was selected. Use Check Answer to check it."
      keyboardSelectedMessage="Jack’s ear selected. Use Check Answer to check your answer."
      correctAnnouncement="Correct. You found Jack’s ear."
      correctAlertMessage="You found Jack’s ear! 🏆"
      wrongAnnouncement="That is not Jack’s ear. Try again."
      wrongAlertMessage="This is not Jack’s ear. Try again!"
      resetAnnouncement="Activity reset. Find Jack’s ear in the picture."
      showAnswerAnnouncement="Jack’s ear is highlighted."
    />
  );
};

export default Unit8_Page1_find;
