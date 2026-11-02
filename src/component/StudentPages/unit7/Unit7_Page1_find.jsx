import React from "react";
import find_img from "../../../assets/unit7/img/U7P58-59.jpg";
import MySVG from "../../../assets/unit7/img/U7P58 highlight.svg";
import targetAudio from "../../../assets/unit7/sound/Page 58/thirsty cat.mp3";

import FindQuestion from "../../FindQuestion";
const targetArea = {
  x1: 18,
  y1: 64,
  x2: 30,
  y2: 78,
};
const Unit7_Page1_find = () => {
  return (
    <FindQuestion
      title="I need your help. Can you help me find the thirsty cat in the picture?"
      subtitle="Scan the full scene, then tap the thirsty cat."
      image={find_img}
      imageAlt="A busy outdoor scene with children and animals showing different feelings and actions."
      targetName="thirsty cat"
      targetArea={targetArea}
      answerHighlight={MySVG}
      targetAudio={targetAudio}
      imageHeight="75vh"
      highlightTop="54%"
      highlightLeft="16.5%"
      highlightHeight="24%"
      targetAriaLabel="Select the thirsty cat"
      pointerSelectedMessage="A point in the scene was selected. Use Check Answer to check it."
      keyboardSelectedMessage="Thirsty cat selected. Use Check Answer to check your answer."
      correctAnnouncement="Correct. You found the thirsty cat."
      correctAlertMessage="You found the thirsty cat! 🏆"
      wrongAnnouncement="That is not the thirsty cat. Try again."
      wrongAlertMessage="This is not the thirsty cat. Try again!"
      resetAnnouncement="Activity reset. Find the thirsty cat in the scene."
      showAnswerAnnouncement="The thirsty cat is highlighted."
    />
  );
};

export default Unit7_Page1_find;
