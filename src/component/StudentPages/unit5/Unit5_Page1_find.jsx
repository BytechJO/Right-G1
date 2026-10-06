import React from "react";

import find_img from "../../../assets/unit5/imgs/P40-41.jpg";
import MySVG from "../../../assets/unit5/imgs/U5P40 highlight.svg";
import targetAudio from "../../../assets/unit5/sounds/Page 40/bookshelf.mp3";

import FindQuestion from "../../FindQuestion";

const targetArea = {
  x1: 44.25,
  y1: 28.76,
  x2: 55.99,
  y2: 40.27,
};

const Unit5_Page1_find = () => {
  return (
    <FindQuestion
      title="I need your help. Can you help me find the bookshelf in the picture?"
      subtitle="Scan the classroom scene, then tap the bookshelf."
      image={find_img}
      imageAlt="A classroom scene with students sitting at desks and a green bookshelf near the front of the room."
      targetName="bookshelf"
      targetArea={targetArea}
      answerHighlight={MySVG}
      targetAudio={targetAudio}
      imageHeight="75vh"
      highlightTop="22%"
      highlightLeft="40.5%"
      highlightHeight="25.5%"
      targetAriaLabel="Select the bookshelf"
      pointerSelectedMessage="A point in the classroom scene was selected. Use Check Answer to check it."
      keyboardSelectedMessage="Bookshelf selected. Use Check Answer to check your answer."
      correctAnnouncement="Correct. You found the bookshelf."
      correctAlertMessage="You found the bookshelf! 🏆"
      wrongAnnouncement="That is not the bookshelf. Try again."
      wrongAlertMessage="This is not the bookshelf. Try again!"
      resetAnnouncement="Activity reset. Find the bookshelf."
      showAnswerAnnouncement="The bookshelf is highlighted."
    />
  );
};

export default Unit5_Page1_find;
