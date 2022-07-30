import React, { useEffect, useRef } from "react";
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
  ["link", "image", "video"],
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

const modules = {
  toolbar: {
    container: toolbarOptions,
  },
  // imageResize: {
  //   // https://www.npmjs.com/package/quill-image-resize-module-react 참고
  //   parchment: Quill.import("parchment"),
  //   modules: ["Resize", "DisplaySize", "Toolbar"],
  // },
};

const Editor = ({ placeholder, value, ...rest }) => {
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
      window.ReactNativeWebView.postMessage(
        JSON.stringify({ msg: "onChange 실행 확인" })
      );
      const file = input.files[0];

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
      input.onchange = async () => {
        window.ReactNativeWebView.postMessage(
          JSON.stringify({ msg: "onChange 실행 확인" })
        );
        const file = input.files[0];

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
    }
  }, []);

  return (
    <ReactQuill
      {...rest}
      ref={quillRef}
      value={value || ""}
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
