const searchParams = new URLSearchParams(window.location.search);

const svg = `<svg viewBox="0 0 36 36" class="spectrum-Icon_368b34 spectrum-Icon--sizeS_368b34 spectrum-Icon_e2d99e" focusable="false" aria-hidden="true" role="img"><path fill="rgb(255, 255, 255)" fill-rule="evenodd" d="M29,16H20V7a1,1,0,0,0-1-1H17a1,1,0,0,0-1,1v9H7a1,1,0,0,0-1,1v2a1,1,0,0,0,1,1h9v9a1,1,0,0,0,1,1h2a1,1,0,0,0,1-1V20h9a1,1,0,0,0,1-1V17A1,1,0,0,0,29,16Z"></path></svg>` // prettier-ignore
const styleForInsertButton = document.createElement("style");
styleForInsertButton.innerHTML = `
.cfEditorEditableContentInsertWrapper {
	position: absolute;
	width: 100%;
	overflow: visible;
	height: 3px;
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: #4096F3;
	transform: translateY(-5px);
	opacity: 0;
	transition: 0.5s opacity ease-in-out;
}
.cfEditorEditableContentInsertWrapper:hover {
	opacity: 1;
}
.cfEditorEditableContentInsertWrapper > button {
	background-color: #005CC8;
	width: 32px;
	height: 32px;
	border-radius: 50%;
	border: 0;
	cursor: pointer;
}
`;
document.head.appendChild(styleForInsertButton);

let topMostEditableElement;

const insertAddAfterButtons = () => {
  const addItemsAfter = document.querySelectorAll("*[data-editable-path][data-cf-add-new='true']");
  if (!addItemsAfter || !addItemsAfter.length) {
    return;
  }

  addItemsAfter.forEach((element) => {
    const wrapperDiv = document.createElement("div");
    wrapperDiv.className = "cfEditorEditableContentInsertWrapper";
    const addAfterButton = document.createElement("button");

    addAfterButton.onclick = () => {
      window.parent.postMessage({type: "editableInsertNew", payload: {path: element.dataset.editablePath, innerCfPath: element.dataset.innerCfPath}},searchParams.get("iFrameHost")) // prettier-ignore
    };

    addAfterButton.innerHTML = svg;
    wrapperDiv.appendChild(addAfterButton);

    element.parentNode.insertBefore(wrapperDiv, element.nextSibling);
  });
};

const handleClick = (event) => {
  const nodeList = document.elementsFromPoint(event.x, event.y);

  topMostEditableElement = nodeList.find((node) => node?.dataset?.editablePath || node.attributes.path);
  if (!topMostEditableElement) {
    return;
  }

  const boundingBox = topMostEditableElement.getBoundingClientRect();
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
        path: [topMostEditableElement?.dataset?.editablePath],
        innerCfPath: topMostEditableElement?.dataset?.innerCfPath,
      },
    },
    searchParams.get("iFrameHost")
  );
};

const handleResize = () => {
  if (topMostEditableElement) {
    const boundingBox = topMostEditableElement.getBoundingClientRect();
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
  window.cfEditorDataFunction(event.data.payload.data);
};

const scrollMessageHandler = (event) => {
  const matchingPathElement = document.querySelector(`[data-editable-path='${event.data.path}']`);
  const box = matchingPathElement.getBoundingClientRect();
  if (box.top >= 0 || box.bottom <= window.innerHeight) {
    return;
  }
  window.scrollBy({ top: box.top, left: 0, behavior: "smooth" });
};

const messageHandler = (event) => {
  if (event.data.type === "setCfData") {
    dataHandler(event);
    setTimeout(insertAddAfterButtons, 1);
    return;
  }

  if (event.data.type === "scrollToPath" && event.data.path) {
    scrollMessageHandler(event);
    return;
  }
};

const editMode = searchParams.get("editMode");
if (editMode !== "false" && editMode !== "HOC") {
  window.addEventListener("message", messageHandler);
  window.addEventListener("click", handleClick);
  window.addEventListener("scroll", handleScroll);
  window.addEventListener("resize", handleResize);
}
