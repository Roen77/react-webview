import logo from "./logo.svg";
import "./App.css";
import Editor from "./components/Editor";
import RNListener from "./components/RNListener";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import Kakao from "./components/Kakao";
import NaverLogin from "./components/Naver";

function App() {
  const requestPermission = () => {
    if (window.ReactNativeWebView) {
      // 모바일이라면 모바일의 카메라 권한을 물어보는 액션을 전달합니다.
      window.ReactNativeWebView.postMessage(
        JSON.stringify({ type: "REQ_CAMERA_PERMISSION" })
      );
    } else {
      // 모바일이 아니라면 모바일 아님을 alert로 띄웁니다.
      alert("모바일이 아닌데요");
    }
  };

  return (
    <>
      {/* <Editor /> */}
      <RNListener />

      <div>
        {/* <button onClick={requestPermission}>
          웹페이지에서 rn으로 전달합니다.
        </button> */}
        {/* <p>지도지도지도지도</p>
        <Map
          center={{ lat: 33.5563, lng: 126.79581 }}
          style={{ width: "100%", height: "360px" }}
        >
          <MapMarker position={{ lat: 33.55635, lng: 126.795841 }}>
            <div style={{ color: "#000" }}>Hello World!</div>
          </MapMarker>
        </Map> */}
      </div>
      <Kakao />
      <NaverLogin />
    </>
  );
}

export default App;
