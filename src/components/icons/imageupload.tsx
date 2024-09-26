const ImageUpload = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 14 14" // Ensure viewBox covers the size of the original SVG
    width={props.width || 20} // Use props for width or a default
    height={props.height || 20} // Use props for height or a default
    fill="none"
    {...props}
  >
    <path
      fill="#8492C4"
      d="M11.333 7.998a.667.667 0 0 0-.666.667v.253l-.987-.986a1.86 1.86 0 0 0-2.62 0l-.467.466L4.94 6.745a1.9 1.9 0 0 0-2.62 0l-.987.987V3.998A.667.667 0 0 1 2 3.332h4.667a.667.667 0 0 0 0-1.334H2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V8.665a.666.666 0 0 0-.667-.667ZM2 12.665a.667.667 0 0 1-.667-.667v-2.38l1.934-1.933a.527.527 0 0 1 .726 0l2.114 2.113 2.866 2.867H2Zm8.667-.667a.594.594 0 0 1-.12.354L7.54 9.332l.467-.467a.513.513 0 0 1 .733 0l1.927 1.94v1.193Zm3.14-9.806-2-2a.667.667 0 0 0-.22-.14.667.667 0 0 0-.507 0 .667.667 0 0 0-.22.14l-2 2a.67.67 0 1 0 .947.946l.86-.866v3.726a.667.667 0 1 0 1.333 0V2.272l.86.866a.667.667 0 0 0 1.093-.217.668.668 0 0 0-.146-.73Z"
    />
  </svg>
);

export default ImageUpload;
