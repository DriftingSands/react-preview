import logo from "../logo.svg";
import Teaser from "./Teaser";

export default function Page({ data }) {
  if (!data) {
    return (
      <h2>
        AEM Fetch failed, log into{" "}
        <a target="_blank" href="https://author-p54352-e854610.adobeaemcloud.com">
          https://author-p54352-e854610.adobeaemcloud.com
        </a>
      </h2>
    );
  }
  return (
    <>
      <h1>
        <img src={logo} alt="react icon" height="24" />
        {data?.header?.toUpperCase()}
      </h1>
      <div className="content">
        <ul>
          {data.listContent.map((item, index) => {
            return (
              <li key={index}>
                <p>{item.plaintext}</p>
              </li>
            );
          })}
        </ul>
        <Teaser teaser={data?.teaser} path={data?.teaser?._path} />
      </div>
    </>
  );
}
