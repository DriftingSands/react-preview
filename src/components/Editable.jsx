import { useEffect,  useRef } from "react";

function editable(WrappedComponent) {
  const searchParams = new URLSearchParams(window.location.search);
  return props => {
    if (searchParams.get("editMode") === "false") {
      return <WrappedComponent {...props} />;
    }

    const path = props.path;

    const editableRef = useRef(null);
    
    
    useEffect(() => {
      function scrollTo(event) {
        if (event?.data?.type !== 'scrollToPath' || event.data.path !== props.path) {return}
        const box = editableRef.current.getBoundingClientRect();
        if (box.top <= 0 && box.bottom >= window.innerHeight) {
          return;
        }
        window.scrollBy({ top: box.top, left: 0, behavior: "smooth" });
      }
        window.addEventListener("message", scrollTo);
        return () => {
          window.removeEventListener("message", scrollTo);
        };
    }, [path, props.path]);
    return <WrappedComponent {...props} data-editable-path={path} editableRef={editableRef} />;
  };
}

export default editable;
