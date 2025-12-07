import WB_Unit1_Page1 from "../WorkBookPages/Unit1/WB_Unit1_Page1";
import WB_Unit1_Page2 from "../WorkBookPages/Unit1/WB_Unit1_Page2";
import WB_Unit1_Page3 from "../WorkBookPages/Unit1/WB_Unit1_Page3";
import WB_Unit1_Page4 from "../WorkBookPages/Unit1/WB_Unit1_Page4";
import WB_Unit1_Page5 from "../WorkBookPages/Unit1/WB_Unit1_Page5";
import WB_Unit1_Page6 from "../WorkBookPages/Unit1/WB_Unit1_Page6";
import WB_Unit1_Page7 from "../WorkBookPages/Unit1/WB_Unit1_Page7";
import WB_Unit1_Page8 from "../WorkBookPages/Unit1/WB_Unit1_Page8";

export const workbookPages = (openPopup, goToUnit) => [
  <WB_Unit1_Page1 />,
  <WB_Unit1_Page2 />,
  <WB_Unit1_Page3 openPopup={openPopup} />,
  <WB_Unit1_Page4 openPopup={openPopup} />,
  <WB_Unit1_Page5 openPopup={openPopup} />,
  <WB_Unit1_Page6 openPopup={openPopup} />,
  <WB_Unit1_Page7 openPopup={openPopup} />,
  <WB_Unit1_Page8 openPopup={openPopup} />,
  // ...
];
