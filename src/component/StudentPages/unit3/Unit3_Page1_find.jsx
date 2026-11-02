import React from "react";

import find_img from "../../../assets/unit3/imgs3/G1_U3_Pg_22-23 copy.jpg";

import MySVG from "../../../assets/unit3/imgs3/U3P22highlight.svg";
import FindQuestion from "../../FindQuestion";

import targetAudio from "../../../assets/unit3/Page 22/boy shutting the window.mp3";

const targetArea = {
  x1: 41,
  y1: 14,
  x2: 53,
  y2: 40,
};

const Unit3_Page1_find = () => {
  return (
    <FindQuestion
      title="I need your help. Can you help me find the boy shutting the window?"
      subtitle="Scan the classroom, then tap the boy who is shutting the window."
      image={find_img}
      targetAudio={targetAudio}
      imageAlt="A classroom scene with children sitting at desks and a boy shutting the window."
      targetName="boy shutting the window"
      targetArea={targetArea}
      answerHighlight={MySVG}
      imageHeight="75vh"
      highlightTop="14%"
      highlightLeft="40.5%"
      highlightHeight="25.5%"
      targetAriaLabel="Select the boy shutting the window"
      pointerSelectedMessage="A point in the classroom scene was selected. Use Check Answer to check it."
      keyboardSelectedMessage="Boy shutting the window selected. Use Check Answer to check your answer."
      correctAnnouncement="Correct. You found the boy shutting the window."
      correctAlertMessage="You found the boy shutting the window! 🏆"
      wrongAnnouncement="That is not the boy shutting the window. Try again."
      wrongAlertMessage="This is not the boy shutting the window. Try again!"
      resetAnnouncement="Activity reset. Find the boy shutting the window."
      showAnswerAnnouncement="The boy shutting the window is highlighted."
    />
  );
};

export default Unit3_Page1_find;
