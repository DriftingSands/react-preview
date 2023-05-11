import logo from "../logo.svg";
import Teaser from "./Teaser";

const ReactLogo = () => {
  return <img src={logo} alt="react icon" height="24" />;
};

export default function Page({ data, onlyExternalData, fetchComplete }) {
  if (data?.header || data?.listContent?.length || data?.teaser) {
    return (
      <>
        <h1>
          <ReactLogo />
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

  if (onlyExternalData) {
    return (
      <h2>
        <ReactLogo />
        Waiting for data...
      </h2>
    );
  }

  if (fetchComplete) {
    return (
      <h2>
        AEM Fetch failed, log into{" "}
        <a target="_blank" rel="noreferrer" href="https://author-p54352-e854610.adobeaemcloud.com">
          https://author-p54352-e854610.adobeaemcloud.com
        </a>
      </h2>
    );
  }

  return (
    <h2>
      <ReactLogo />
      Fetching data...
    </h2>
  );
}
