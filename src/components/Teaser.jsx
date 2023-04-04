import editable from "./Editable"

function Teaser({teaser, editableRef}) {
  return (
    <div class="teaser" path={teaser?._path} ref={editableRef} >
		<div class="image">
			<img
				src={"https://author-p54352-e854610.adobeaemcloud.com" + teaser?.image._path}
				alt={teaser?.imageAltText.plaintext}
			/>
		</div>
		<div class="textContent">
			<h4>{teaser?.title}</h4>
			<p>{teaser?.description?.plaintext}</p>
			<div class="buttons">
        {teaser?.readMoreLink && <a href={teaser?.readMoreLink} target="_blank" rel="noreferrer">Read More</a>}
        {teaser?.sourceLink && <a href={teaser?.sourceLink} target="_blank" rel="noreferrer">Source</a>}
			</div>
		</div>
	</div>
  )
}

export default editable(Teaser)