import React from "react";

import find_img from "../../../assets/unit6/imgs/G1_U6_Pg_46-47 copy.jpg";

import MySVG from "../../../assets/unit6/imgs/Asset 6.svg";

import targetAudio from "../../../assets/unit6/sounds/Page 46/the fence.mp3";

import FindQuestion from "../../FindQuestion";

/* =====================================================
   TARGET AREA - FENCE
===================================================== */

const targetArea = {
  x1: 0.1,
  y1: 29.4,
  x2: 83.7,
  y2: 40,
};

const Unit6_Page1_find = () => {
  return (
    <FindQuestion
      title="I need your help. Can you help me find the fence in the picture?"
      subtitle="Scan the whole park scene, then tap the fence."
      image={find_img}
      imageAlt="A park scene with children playing, riding a bicycle and scooter, flying a kite, sitting by a tree, swimming in a small pool, and a fence stretching across the background."
      targetName="fence"
      targetArea={targetArea}
      answerHighlight={MySVG}
      targetAudio={targetAudio}
      imageHeight="75vh"
      highlightTop="28%"
      highlightLeft="0.5%"
      highlightHeight="8.1%"
      targetAriaLabel="Select the fence"
      pointerSelectedMessage="A point in the park scene was selected. Use Check Answer to check it."
      keyboardSelectedMessage="Fence selected. Use Check Answer to check your answer."
      correctAnnouncement="Correct. You found the fence."
      correctAlertMessage="You found the fence! 🏆"
      wrongAnnouncement="That is not the fence. Try again."
      wrongAlertMessage="This is not the fence. Try again!"
      resetAnnouncement="Activity reset. Find the fence in the park scene."
      showAnswerAnnouncement="The fence is highlighted."
    />
  );
};

export default Unit6_Page1_find;
