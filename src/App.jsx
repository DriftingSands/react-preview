import "./App.css";
import Page from "./components/Page";
import { useEffect, useRef, useState } from "react";

function App() {
  const topMostEditableElement = useRef(null);
  const searchParams = new URLSearchParams(window.location.search);
  const [data, setData] = useState(null);
  const [onlyExternalData, setOnlyExternalData] = useState(false);
  const [fetchComplete, setFetchComplete] = useState(false);

  const getData = async () => {
    try {
      const response = await fetch(
        "https://author-p54352-e854610.adobeaemcloud.com/graphql/execute.json/sample-list/Homepage",
        { credentials: "include" }
      );
      const fetchData = await response.json();
      setData(fetchData?.data?.pageByPath?.item);
      setFetchComplete(true);
    } catch (error) {
      setFetchComplete(true);
    }
  };

  const handleClick = (event) => {
    const nodeList = document.elementsFromPoint(event.x, event.y);

    topMostEditableElement.current = nodeList.find((node) => node?.dataset?.editablePath || node.attributes.path);
    if (!topMostEditableElement.current) {
      return;
    }

    const boundingBox = topMostEditableElement?.current?.getBoundingClientRect();
    window.parent.postMessage(
      {
        type: "editableBoundingRect",
        payload: [
          boundingBox.top + document.documentElement.scrollTop,
          boundingBox.left,
          boundingBox.height,
          boundingBox.width,
        ],
      },
      searchParams.get("iFrameHost")
    );

    window.parent.postMessage(
      {
        type: "editablePath",
        payload: {
          path: [topMostEditableElement?.current?.dataset?.editablePath],
          content: {
            textContent: topMostEditableElement?.current.textContent,
            src: topMostEditableElement?.current.src || topMostEditableElement.current.querySelector("img").src
          }
        }
      },
      searchParams.get("iFrameHost")
    );
  };

  const handleResize = () => {
    if (topMostEditableElement?.current) {
      const boundingBox = topMostEditableElement?.current.getBoundingClientRect();
      if (boundingBox) {
        window.parent.postMessage(
          {
            type: "editableBoundingRect",
            payload: [
              boundingBox.top + document.documentElement.scrollTop,
              boundingBox.left,
              boundingBox.height,
              boundingBox.width,
            ],
          },
          searchParams.get("iFrameHost")
        );
      }
    }
  };

  const handleScroll = () => {
    window.parent.postMessage(
      {
        type: "scrollTop",
        payload: document.documentElement.scrollTop,
      },
      searchParams.get("iFrameHost")
    );
  };

  const dataHandler = (event) => {
    if (event.data.type !== "setCfData") {
      return;
    }
    setData(event.data.payload.data);
  };

  useEffect(() => {
    if (searchParams.get("onlyExternalData") === "true") {
      setOnlyExternalData(true);
    } else {
      getData();
    }
    if (searchParams.get("editMode") === "HOC") {
      window.addEventListener("message", dataHandler);
      window.addEventListener("click", handleClick);
      window.addEventListener("scroll", handleScroll);
      window.addEventListener("resize", handleResize);
    } else if (searchParams.get("editMode") !== "false") {
      window.cfEditorDataFunction = (event) => setData(event.data.payload.data);
    }

    return () => {
      window.removeEventListener("message", dataHandler);
      window.removeEventListener("click", handleClick);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [handleClick, handleScroll, handleResize, dataHandler]);

  return (
    <main className="App">
      <Page data={data} onlyExternalData={onlyExternalData} fetchComplete={fetchComplete} />
    </main>
  );
}

export default App;
