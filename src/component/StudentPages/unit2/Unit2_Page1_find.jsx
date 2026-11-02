import React from "react";

import find_img from "../../../assets/img_unit2/imgs/02-03 New copy.jpg";
import MySVG from "../../../assets/img_unit2/imgs/U2P10 highlight.svg";

import targetAudio from "../../../assets/unit2/Page 10/boat.mp3";

import FindQuestion from "../../FindQuestion";

const targetArea = {
  x1: 18,
  y1: 67.5,
  x2: 24,
  y2: 74,
};

const Unit2_Page1_find = () => {
  return (
    <FindQuestion
      title="I need your help. Can you help me find the boat in the picture?"
      subtitle="Look carefully around the party, then tap the boat."
      image={find_img}
      imageAlt="A birthday party scene with children, decorations, balloons, cake, gifts, and a small boat hidden in the scene."
      targetName="boat"
      targetArea={targetArea}
      answerHighlight={MySVG}
      targetAudio={targetAudio}
      imageHeight="75vh"
      highlightTop="67%"
      highlightLeft="18.5%"
      highlightHeight="7%"
      targetAriaLabel="Select the boat"
      pointerSelectedMessage="A point in the birthday party scene was selected. Use Check Answer to check it."
      keyboardSelectedMessage="Boat selected. Use Check Answer to check your answer."
      correctAnnouncement="Correct. You found the boat."
      correctAlertMessage="You found the boat! 🏆"
      wrongAnnouncement="That is not the boat. Try again."
      wrongAlertMessage="This is not the boat. Try again!"
      resetAnnouncement="Activity reset. Find the boat."
      showAnswerAnnouncement="The boat is highlighted."
    />
  );
};

export default Unit2_Page1_find;
