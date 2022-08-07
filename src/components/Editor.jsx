import React, { useEffect, useRef, useState } from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import ImageResize from "quill-image-resize-module-react";

Quill.register("modules/imageResize", ImageResize);

// const modules = {
//     toolbar: {
//       container: toolbarOptions,
//     },
//     imageResize: {
//       // https://www.npmjs.com/package/quill-image-resize-module-react 참고
//       parchment: Quill.import("parchment"),
//       modules: ["Resize", "DisplaySize", "Toolbar"],
//     },
//   };
//   출처: https://mingeesuh.tistory.com/entry/Quill-React-에디터-사용해보기-이미지-업로드-및-사이즈-조절 [코딩마차:티스토리]

// 사용하고 싶은 옵션, 나열 되었으면 하는 순서대로 나열
const toolbarOptions = [
  [{ header: [1, 2, 3, false] }],
  ["bold", "italic", "underline", "strike"],
  ["blockquote"],
  [{ list: "ordered" }, { list: "bullet" }],
  [{ color: [] }, { background: [] }],
  [{ align: [] }],
  ["link", "image", "video", "custom"],
];

// 옵션에 상응하는 포맷, 추가해주지 않으면 text editor에 적용된 스타일을 볼수 없음
export const formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "align",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "background",
  "color",
  "link",
  "image",
  "video",
  "width",
];

const CustomHeart = () => <span>♥</span>;

function insertHeart() {
  const cursorPosition = this.quill.getSelection().index;
  this.quill.insertText(cursorPosition, "♥");
  this.quill.setSelection(cursorPosition + 1);
}

const modules = {
  toolbar: {
    container: toolbarOptions,
    handlers: {
      custom: function () {
        alert("DAGUR");
      },
    },
    // handlers: {
    //   insertHeart: insertHeart,
    // },
  },
  // imageResize: {
  //   // https://www.npmjs.com/package/quill-image-resize-module-react 참고
  //   parchment: Quill.import("parchment"),
  //   modules: ["Resize", "DisplaySize", "Toolbar"],
  // },
};

const Editor = ({ placeholder, ...rest }) => {
  const [value, setValue] = useState("");
  // quill 에디터 컴포넌트 ref
  const quillRef = useRef(null);

  // modules를 통해 핸들러를 추가해주는 방법과 toolbar를 선택해서 핸들러를 추가해주는 방법이 있다
  // const modules = {
  //   toolbar: {
  //     container: toolbarOptions,
  //     handlers: {
  //       image: handleImage
  //     }
  //   },
  // };

  const test = () => {
    const { getEditor } = quillRef.current;
    // const file = input.files[0];

    // 현재 커서 위치 저장
    const range = getEditor().getSelection(true);

    // 서버에 올려질때까지 표시할 로딩 placeholder 삽입
    getEditor().insertEmbed(range.index, "image", `/images/loading.gif`);

    try {
      // 필자는 파이어 스토어에 저장하기 때문에 이런식으로 유틸함수를 따로 만들어줬다
      // 이런식으로 서버에 업로드 한뒤 이미지 태그에 삽입할 url을 반환받도록 구현하면 된다
      const filePath = `contents/temp/${Date.now()}`;
      //   const url = await uploadImage(file, filePath);
      const url = "https://picsum.photos/200/300";

      // 정상적으로 업로드 됐다면 로딩 placeholder 삭제
      getEditor().deleteText(range.index, 1);
      // 받아온 url을 이미지 태그에 삽입
      // getEditor().insertEmbed(range.index, "image", url);
      getEditor().insertEmbed(
        range.index,
        "image",
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAApgAAAKYB3X3/OAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAANCSURBVEiJtZZPbBtFFMZ/M7ubXdtdb1xSFyeilBapySVU8h8OoFaooFSqiihIVIpQBKci6KEg9Q6H9kovIHoCIVQJJCKE1ENFjnAgcaSGC6rEnxBwA04Tx43t2FnvDAfjkNibxgHxnWb2e/u992bee7tCa00YFsffekFY+nUzFtjW0LrvjRXrCDIAaPLlW0nHL0SsZtVoaF98mLrx3pdhOqLtYPHChahZcYYO7KvPFxvRl5XPp1sN3adWiD1ZAqD6XYK1b/dvE5IWryTt2udLFedwc1+9kLp+vbbpoDh+6TklxBeAi9TL0taeWpdmZzQDry0AcO+jQ12RyohqqoYoo8RDwJrU+qXkjWtfi8Xxt58BdQuwQs9qC/afLwCw8tnQbqYAPsgxE1S6F3EAIXux2oQFKm0ihMsOF71dHYx+f3NND68ghCu1YIoePPQN1pGRABkJ6Bus96CutRZMydTl+TvuiRW1m3n0eDl0vRPcEysqdXn+jsQPsrHMquGeXEaY4Yk4wxWcY5V/9scqOMOVUFthatyTy8QyqwZ+kDURKoMWxNKr2EeqVKcTNOajqKoBgOE28U4tdQl5p5bwCw7BWquaZSzAPlwjlithJtp3pTImSqQRrb2Z8PHGigD4RZuNX6JYj6wj7O4TFLbCO/Mn/m8R+h6rYSUb3ekokRY6f/YukArN979jcW+V/S8g0eT/N3VN3kTqWbQ428m9/8k0P/1aIhF36PccEl6EhOcAUCrXKZXXWS3XKd2vc/TRBG9O5ELC17MmWubD2nKhUKZa26Ba2+D3P+4/MNCFwg59oWVeYhkzgN/JDR8deKBoD7Y+ljEjGZ0sosXVTvbc6RHirr2reNy1OXd6pJsQ+gqjk8VWFYmHrwBzW/n+uMPFiRwHB2I7ih8ciHFxIkd/3Omk5tCDV1t+2nNu5sxxpDFNx+huNhVT3/zMDz8usXC3ddaHBj1GHj/As08fwTS7Kt1HBTmyN29vdwAw+/wbwLVOJ3uAD1wi/dUH7Qei66PfyuRj4Ik9is+hglfbkbfR3cnZm7chlUWLdwmprtCohX4HUtlOcQjLYCu+fzGJH2QRKvP3UNz8bWk1qMxjGTOMThZ3kvgLI5AzFfo379UAAAAASUVORK5CYII="
      );

      // 사용자 편의를 위해 커서 이미지 오른쪽으로 이동
      getEditor().setSelection(range.index + 1);
    } catch (e) {
      window.ReactNativeWebView.postMessage(
        JSON.stringify({ type: e, msg: "이미지 업로드 오류" })
      );
      // getEditor().deleteText(range.index, 1);
    }
  };

  const handleChange = (e) => {
    // alert(JSON.stringify({ e }));
    console.log("변화 확인:", e);
  };
  useEffect(() => {
    // window.ReactNativeWebView.postMessage(JSON.stringify({ msg: "useEffect" }));
    const handleImage = () => {
      window.ReactNativeWebView.postMessage(
        JSON.stringify({ msg: "handleImage 실행 확인" })
      );
      const input = document.createElement("input");
      const { getEditor } = quillRef.current;
      input.setAttribute("type", "file");
      input.setAttribute("accept", "image/*");
      input.click();
      // window.ReactNativeWebView.postMessage(
      //   JSON.stringify({ msg: "onChange 실행 확인" })
      // );
      // const file = input.files[0];

      // // 현재 커서 위치 저장
      // const range = getEditor().getSelection(true);

      // // 서버에 올려질때까지 표시할 로딩 placeholder 삽입
      // getEditor().insertEmbed(range.index, "image", `/images/loading.gif`);

      // try {
      //   // 필자는 파이어 스토어에 저장하기 때문에 이런식으로 유틸함수를 따로 만들어줬다
      //   // 이런식으로 서버에 업로드 한뒤 이미지 태그에 삽입할 url을 반환받도록 구현하면 된다
      //   const filePath = `contents/temp/${Date.now()}`;
      //   //   const url = await uploadImage(file, filePath);
      //   const url = "https://picsum.photos/200/300";

      //   // 정상적으로 업로드 됐다면 로딩 placeholder 삭제
      //   getEditor().deleteText(range.index, 1);
      //   // 받아온 url을 이미지 태그에 삽입
      //   getEditor().insertEmbed(range.index, "image", url);

      //   // 사용자 편의를 위해 커서 이미지 오른쪽으로 이동
      //   getEditor().setSelection(range.index + 1);
      // } catch (e) {
      //   window.ReactNativeWebView.postMessage(
      //     JSON.stringify({ type: e, msg: "이미지 업로드 오류" })
      //   );
      //   // getEditor().deleteText(range.index, 1);
      // }
      input.onchange = async () => {
        const file = input.files[0];
        window.ReactNativeWebView.postMessage(
          JSON.stringify({ msg: "onChange 실행 확인" })
        );

        // 현재 커서 위치 저장
        const range = getEditor().getSelection(true);

        // 서버에 올려질때까지 표시할 로딩 placeholder 삽입
        getEditor().insertEmbed(range.index, "image", `/images/loading.gif`);

        try {
          // 필자는 파이어 스토어에 저장하기 때문에 이런식으로 유틸함수를 따로 만들어줬다
          // 이런식으로 서버에 업로드 한뒤 이미지 태그에 삽입할 url을 반환받도록 구현하면 된다
          const filePath = `contents/temp/${Date.now()}`;
          //   const url = await uploadImage(file, filePath);
          const url = "https://picsum.photos/200/300";

          // 정상적으로 업로드 됐다면 로딩 placeholder 삭제
          getEditor().deleteText(range.index, 1);
          // 받아온 url을 이미지 태그에 삽입
          getEditor().insertEmbed(range.index, "image", url);

          // 사용자 편의를 위해 커서 이미지 오른쪽으로 이동
          getEditor().setSelection(range.index + 1);
        } catch (e) {
          window.ReactNativeWebView.postMessage(
            JSON.stringify({ type: e, msg: "이미지 업로드 오류" })
          );
          // getEditor().deleteText(range.index, 1);
        }
      };
    };
    //mingeesuh.tistory.com/entry/Quill-React-에디터-사용해보기-이미지-업로드-및-사이즈-조절 [코딩마차:티스토리]
    // mingeesuh.tistory.com/entry/Quill-React-에디터-사용해보기-이미지-업로드-및-사이즈-조절 [코딩마차:티스토리]

    if (quillRef.current) {
      const { getEditor } = quillRef.current;
      const toolbar = quillRef.current.getEditor().getModule("toolbar");
      toolbar.addHandler("image", handleImage);
      toolbar.addHandler("custom", test);
    }
  }, []);

  return (
    <ReactQuill
      {...rest}
      ref={quillRef}
      value={value || ""}
      onChange={handleChange}
      theme="snow"
      modules={{
        ...modules,
        imageResize: {
          parchment: Quill.import("parchment"),
          modules: ["Resize", "DisplaySize", "Toolbar"],
        },
      }}
      formats={formats}
      placeholder={placeholder}
      preserveWhitespace
    ></ReactQuill>
  );
};

export default Editor;
//   출처: https://mingeesuh.tistory.com/entry/Quill-React-에디터-사용해보기-이미지-업로드-및-사이즈-조절 [코딩마차:티스토리]
