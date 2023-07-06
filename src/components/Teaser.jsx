import editable from "./Editable";

function Teaser({ teaser, editableRef, editablePath }) {
  return (
    <div className="teaser" path={teaser?._path} ref={editableRef} data-editable-path={editablePath || teaser?._path}>
      <div className="image">
        <img
          src={"https://publish-p54352-e854610.adobeaemcloud.com" + teaser?.image?._path}
          alt={teaser?.imageAltText?.plaintext}
          data-editable-path={teaser?._path}
          data-inner-cf-path={".image._path"}
        />
      </div>
      <div className="textContent">
        <h4 data-editable-path={teaser?._path} data-inner-cf-path={".title"}>{teaser?.title}</h4>
        <p data-editable-path={teaser?._path} data-inner-cf-path={".description.plaintext"}>{teaser?.description?.plaintext}</p>
        <div className="buttons">
          {teaser?.readMoreLink && (
            <a href={teaser?.readMoreLink} target="_blank" rel="noreferrer">
              Read More
            </a>
          )}
          {teaser?.sourceLink && (
            <a href={teaser?.sourceLink} target="_blank" rel="noreferrer">
              Source
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default editable(Teaser);
