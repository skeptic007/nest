const UserTag = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 14 16" // Set the viewBox to cover the original dimensions
    width={props.width || 20} // Set default width or use passed prop
    height={props.height || 20} // Set default height or use passed prop
    fill="none"
    {...props}
  >
    <path
      fill="#8492C4"
      d="M5.389.682c-2.1 0-3.77 1.68-3.77 3.794a3.793 3.793 0 0 0 .434 1.785c.288.55.707 1.02 1.22 1.367a5.437 5.437 0 0 0-3.27 4.98h1.078c0-2.385 1.938-4.337 4.308-4.337 2.1 0 3.769-1.68 3.769-3.795 0-2.114-1.67-3.794-3.77-3.794Zm0 1.084c1.507 0 2.692 1.193 2.692 2.71 0 1.518-1.185 2.71-2.692 2.71-1.508 0-2.693-1.192-2.693-2.71 0-1.517 1.185-2.71 2.693-2.71ZM8.08 8.271c-.592 0-1.077.488-1.077 1.084v2.386l3.23 3.252c.216.217.485.325.755.325.269 0 .538-.108.753-.325l1.939-1.952c.215-.216.323-.487.323-.758s-.108-.542-.323-.76l-3.23-3.252H8.08Zm0 1.084h1.938l2.908 2.928-1.938 1.951-2.908-2.927V9.355Zm1.077.542a.537.537 0 0 0-.539.543.544.544 0 0 0 .539.542.537.537 0 0 0 .538-.542.544.544 0 0 0-.538-.543Z"
    />
  </svg>
);

export default UserTag;
