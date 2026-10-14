import React from "react";
import find_img from "../../../assets/unit10/imgs/G1_10 _Pg_82-83 copy.jpg";
import MySVG from "../../../assets/unit10/imgs/U9P82Highlight.svg";
import FindQuestion from "../../FindQuestion";
import targetAudio from "../../../assets/unit10/sound/Page 82/cupcakes.mp3";
const targetArea = {
  x1: 21.96,
  y1: 45.26,
  x2: 28.41,
  y2: 50.5,
};
const Unit10_Page1_find = () => {
  return (
    <FindQuestion
      title="I need your help. Can you help me find the cupcakes in the picture?"
      subtitle="Scan the whole shop scene, then tap the cupcakes."
      image={find_img}
      targetAudio={targetAudio}
      imageAlt="A cafeteria scene with food and people. Find the cupcakes in the picture."
      targetName="cupcakes"
      targetArea={targetArea}
      answerHighlight={MySVG}
      imageHeight="75vh"
      highlightTop="41%"
      highlightLeft="21%"
      highlightHeight="13%"
      targetAriaLabel="Select the cupcakes"
      pointerSelectedMessage="A point in the picture was selected. Use Check Answer to check it."
      keyboardSelectedMessage="Cupcakes selected. Use Check Answer to check your answer."
      correctAnnouncement="Correct. You found the cupcakes."
      correctAlertMessage="You found the cupcakes! 🏆"
      wrongAnnouncement="Those are not the cupcakes. Try again."
      wrongAlertMessage="Those are not the cupcakes. Try again!"
      resetAnnouncement="Activity reset. Find the cupcakes in the picture."
      showAnswerAnnouncement="The cupcakes are highlighted."
    />
  );
};

export default Unit10_Page1_find;
