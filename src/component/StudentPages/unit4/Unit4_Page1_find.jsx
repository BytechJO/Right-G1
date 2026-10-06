import React from "react";

import find_img from "../../../assets/unit4/imgs/G1_U4_Pg_28-29 copy.jpg";

import MySVG from "../../../assets/unit4/imgs/U4P28 highlight.svg";

import targetAudio from "../../../assets/unit4/Page 28/sea.mp3";

import FindQuestion from "../../FindQuestion";

const targetArea = {
  x1: 53,
  y1: 7,
  x2: 75,
  y2: 27,
};

const Unit4_Page1_find = () => {
  return (
    <FindQuestion
      title="I need your help. Can you help me find the sea in the picture?"
      subtitle="Look across the full scene, then tap the sea."
      image={find_img}
      imageAlt="An art classroom scene with children drawing and painting, with pictures on the wall including a framed picture of the sea."
      targetName="sea"
      targetArea={targetArea}
      answerHighlight={MySVG}
      targetAudio={targetAudio}
      imageHeight="75vh"
      highlightTop="7%"
      highlightLeft="53%"
      highlightWidth="22%"
      highlightHeight="20%"
      targetAriaLabel="Select the sea"
      pointerSelectedMessage="A point in the picture was selected. Use Check Answer to check it."
      keyboardSelectedMessage="Sea selected. Use Check Answer to check your answer."
      correctAnnouncement="Correct. You found the sea."
      correctAlertMessage="You found the sea! 🏆"
      wrongAnnouncement="That is not the sea. Try again."
      wrongAlertMessage="This is not the sea. Try again!"
      resetAnnouncement="Activity reset. Find the sea in the picture."
      showAnswerAnnouncement="The sea is highlighted."
    />
  );
};

export default Unit4_Page1_find;
