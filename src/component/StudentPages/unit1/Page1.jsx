import React,{useEffect} from "react";
import page_1 from "../../../assets/unit1/imgs/Pages from cover right SbEd copy.pdf.png";
import { ALL_ASSETS  } from "../../../audioList";
const Page1 = () => {

  // useEffect(() => {
  //   // إذا خلص التحميل قبل، ما نعيده
  //   if (localStorage.getItem("offline-ready")) return;

  //   // نتأكد إن Service Worker شغّال
  //   if (!navigator.serviceWorker?.controller) return;

  //   // نطلب من الـ Service Worker يحمّل كل الأوديو
  //   navigator.serviceWorker.controller.postMessage({
  //     type: "PRELOAD_ALL",
  //     audioList: ALL_ASSETS 
  //   });

  //   // نسمع لما يخلص
  //   const onMessage = (event) => {
  //     if (event.data?.type === "PRELOAD_DONE") {
  //       localStorage.setItem("offline-ready", "true");
  //       alert("📘 الكتاب صار جاهز للاستخدام بدون إنترنت");
  //     }
  //   };

  //   navigator.serviceWorker.addEventListener("message", onMessage);

  //   return () => {
  //     navigator.serviceWorker.removeEventListener("message", onMessage);
  //   };
  // }, []);

  return (
    <div
      className="page1-img-wrapper"
      style={{ backgroundImage: `url(${page_1})` }}
    ></div>
  );
};


export default Page1;


