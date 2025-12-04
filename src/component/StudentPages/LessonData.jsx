import Page8_Q1 from "./unit1/Page8_Q1";
import Page8_Q2 from "./unit1/Page8_Q2";
import Page8_Q3 from "./unit1/Page8_Q3";
import Page8_Q4 from "./unit1/Page8_Q4";
import Page9_Q1 from "./unit1/Page9_Q1";
import Page9_Q2 from "./unit1/Page9_Q2";

import Unit2_Page5_Q1 from "./unit2/Unit2_Page5_Q1";
import Unit2_Page5_Q2 from "./unit2/Unit2_Page5_Q2";
import Unit2_Page5_Q3 from "./unit2/Unit2_Page5_Q3";
import Unit2_Page5_Q4 from "./unit2/Unit2_Page5_Q4";
import Unit2_Page6_Q1 from "./unit2/Unit2_Page6_Q1";
import Unit2_Page6_Q2 from "./unit2/Unit2_Page6_Q2";

import Unit2_Page7_Q1 from "./unit2/Unit2_Page7_Q1";
import Unit2_Page7_Q2 from "./unit2/Unit2_Page7_Q2";
import Unit2_Page7_Q3 from "./unit2/Unit2_Page7_Q3";

import Unit2_Page8_Q1 from "./unit2/Unit2_Page8_Q1";
import Unit2_Page8_Q2 from "./unit2/Unit2_Page8_Q2";
import Unit2_Page8_Q3 from "./unit2/Unit2_Page8_Q3";

import Unit2_Page9_Q1 from "./unit2/Unit2_Page9_Q1";
import Unit2_Page9_Q2 from "./unit2/Unit2_Page9_Q2";
import Unit2_Page9_Q3 from "./unit2/Unit2_Page9_Q3";

import Unit2_Page10_Q1 from "./unit2/Unit2_Page10_Q1";
import Unit2_Page10_Q2 from "./unit2/Unit2_Page10_Q2";
import Unit2_Page10_Q3 from "./unit2/Unit2_Page10_Q3";
import Unit2_Page10_Q4 from "./unit2/Unit2_Page10_Q4";

import Unit3_Page5_Q1 from "./unit3/Unit3_Page5_Q1";
import Unit3_Page5_Q2 from "./unit3/Unit3_Page5_Q2";
import Unit3_Page5_Q3 from "./unit3/Unit3_Page5_Q3";
import Unit3_Page5_Q4 from "./unit3/Unit3_Page5_Q4";
import Unit3_Page6_Q2 from "./unit3/Unit3_Page6_Q2";
import Unit3_Page6_Q3 from "./unit3/Unit3_Page6_Q3";

import Unit4_Page5_Q1 from "./unit4/Unit4_Page5_Q1";
import Unit4_Page5_Q2 from "./unit4/Unit4_Page5_Q2";
import Unit4_Page5_Q3 from "./unit4/Unit4_Page5_Q3";
import Unit4_Page5_Q4 from "./unit4/Unit4_Page5_Q4";
import Unit4_Page6_Q2 from "./unit4/Unit4_Page6_Q2";





export const lessons = [
  // UNIT 1
  { component: Page8_Q1, unit: 1 },
  { component: Page8_Q2, unit: 1 },
  { component: Page8_Q3, unit: 1 },
  { component: Page8_Q4, unit: 1 },
  { component: Page9_Q1, unit: 1 },
  { component: Page9_Q2, unit: 1, lastOfUnit: true },

  // UNIT 2 MAIN
  { component: Unit2_Page5_Q1, unit: 2 },
  { component: Unit2_Page5_Q2, unit: 2 },
  { component: Unit2_Page5_Q3, unit: 2 },
  { component: Unit2_Page5_Q4, unit: 2 },
  { component: Unit2_Page6_Q1, unit: 2 },
  { component: Unit2_Page6_Q2, unit: 2, lastOfUnit: true },

  // REVIEW
  { component: Unit2_Page7_Q1, unit: 2, isReview: true },
  { component: Unit2_Page7_Q2, unit: 2, isReview: true },
  { component: Unit2_Page7_Q3, unit: 2, isReview: true },
  { component: Unit2_Page8_Q1, unit: 2, isReview: true },
  { component: Unit2_Page8_Q2, unit: 2, isReview: true },
  { component: Unit2_Page8_Q3, unit: 2, isReview: true },
  { component: Unit2_Page9_Q1, unit: 2, isReview: true },
  { component: Unit2_Page9_Q2, unit: 2, isReview: true },
  { component: Unit2_Page9_Q3, unit: 2, isReview: true },
  { component: Unit2_Page10_Q1, unit: 2, isReview: true },
  { component: Unit2_Page10_Q2, unit: 2, isReview: true },
  { component: Unit2_Page10_Q3, unit: 2, isReview: true },
  { component: Unit2_Page10_Q4, unit: 2, isReview: true, lastOfReview: true },

   // UNIT 3 MAIN
  { component: Unit3_Page5_Q1, unit: 3 },
  { component: Unit3_Page5_Q2, unit: 3 },
  { component: Unit3_Page5_Q3, unit: 3 },
  { component: Unit3_Page5_Q4, unit: 3 },
  { component: Unit3_Page6_Q2, unit: 3 },
  { component: Unit3_Page6_Q3, unit: 3, lastOfUnit: true },//30

   // UNIT 4 MAIN
  { component: Unit4_Page5_Q1, unit: 4 },
  { component: Unit4_Page5_Q2, unit: 4 },
  { component: Unit4_Page5_Q3, unit: 4 },
  { component: Unit4_Page5_Q4, unit: 4 },
  { component: Unit4_Page6_Q2, unit: 4, lastOfUnit: true },//36
];