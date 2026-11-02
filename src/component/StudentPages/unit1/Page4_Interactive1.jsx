import React from "react";

import backgroundImage from "../../../assets/unit1/imgs/Page 01/01.jpg";

import MySVG from "../../../assets/unit1/imgs/U1P4 highlight 1.svg";

import FindQuestion from "../../FindQuestion";
import targetAudio from "../../../assets/unit1/Page 4/restaurant.mp3";

/* =====================================================
   TARGET AREA - RESTAURANT
===================================================== */
const targetArea = {
  x1: 24,
  y1: 8.5,
  x2: 59,
  y2: 43,
};

const Page4_Interactive1 = () => {
  return (
    <FindQuestion
      title="I need your help. Can you help me find the restaurant in the picture?"
      subtitle="Scan the whole picture, then tap the restaurant."
      image={backgroundImage}
      imageAlt="A schoolyard scene with children standing and walking near a restaurant, a clothing shop, trees, and a parked car."
      targetName="restaurant"
      targetArea={targetArea}
      answerHighlight={MySVG}
      targetAudio={targetAudio}
      imageHeight="70vh"
      highlightTop="8.5%"
      highlightLeft="24%"
      highlightWidth="35%"
      highlightHeight="34.5%"
      targetAriaLabel="Select the restaurant"
      pointerSelectedMessage="A point in the scene was selected. Use Check Answer to check it."
      keyboardSelectedMessage="Restaurant selected. Use Check Answer to check your answer."
      correctAnnouncement="Correct. You found the restaurant."
      correctAlertMessage="You found the restaurant! 🏆"
      wrongAnnouncement="That is not the restaurant. Try again."
      wrongAlertMessage="This is not the restaurant. Try again!"
      resetAnnouncement="Activity reset. Find the restaurant in the scene."
      showAnswerAnnouncement="The correct restaurant is highlighted."
    />
  );
};

export default Page4_Interactive1;
