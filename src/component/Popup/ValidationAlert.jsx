import Swal from "sweetalert2";
import './ValidationAlert.css';
import good from "../../assets/alert/goodjob.gif";
import wrong from "../../assets/alert/wrong.gif";
import Notice from "../../assets/alert/Notice.gif";

const ValidationAlert = {

  // ✅ لكل الإجابات الصحيحة
  success: (scoreMessage) => {
    Swal.fire({
      
      html: `
      <div style="font-size: 20px; text-align: center;">
        <p style="color: green; font-weight: bold;">
          ${scoreMessage}
        </p>
      </div>`,
      imageUrl: good,
      imageWidth: 200,
      imageHeight: 200,
      background: "#dfeaf6",
      confirmButtonText: "Good Job",
      allowOutsideClick: true,
      allowEscapeKey: true,
      buttonsStyling: false,
      customClass: {
        popup: "my-popup",
        image: "my-image",
        title: "my-title",
        content: "my-content",
        confirmButton: "my-button",
      },
    });
  },

  // 🟠 إذا في إجابات صحيحة وإجابات خاطئة
  warning: (scoreMessage) => {
    Swal.fire({
    
      html: `
      <div style="font-size: 20px; text-align: center;">
        
        <p style="color: orange; font-weight: bold;">
          ${scoreMessage}
        </p>
      </div>`,
      imageUrl: Notice,
      imageWidth: 200,
      imageHeight: 200,
      background: "#fff4d9",
      confirmButtonText: "Continue",
      allowOutsideClick: true,
      allowEscapeKey: true,
      buttonsStyling: false,
      customClass: {
        popup: "my-popup",
        image: "my-image",
        title: "my-title",
        content: "my-content",
        confirmButton: "my-button2",
      },
    });
  },

  // ❌ إذا ولا إجابة صحيحة
  error: (scoreMessage) => {
    Swal.fire({
   
      html: `
      <div style="font-size: 20px; text-align: center;">
        <p style="color: red; font-weight: bold;">
          ${scoreMessage}
        </p>
        
      </div>`,
      imageUrl: wrong,
      imageWidth: 200,
      imageHeight: 200,
      background: "#fde4e4",
      confirmButtonText: "Try Again",
      allowOutsideClick: true,
      allowEscapeKey: true,
      buttonsStyling: false,
      customClass: {
        popup: "my-popup",
        image: "my-image",
        title: "my-title",
        content: "my-content",
        confirmButton: "my-button1",
      },
    });
  },

  // 🟡 إذا ما كمل الطالب الحل
  info: () => {
    Swal.fire({
      title: "Oops!",
      html: "Please complete all fields.",
      imageUrl: Notice,
      imageWidth: 200,
      imageHeight: 200,
      background: "#dfeaf6",
      confirmButtonText: "OK",
      allowOutsideClick: true,
      allowEscapeKey: true,
      buttonsStyling: false,
      customClass: {
        popup: "my-popup",
        image: "my-image",
        title: "my-title",
        content: "my-content",
        confirmButton: "my-button3",
      },
    });
  },
};

export default ValidationAlert;
