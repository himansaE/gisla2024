export const Sparkles = (props: {
  size?: number;
  fill?: string;
  className?: string;
}) => {
  return (
    <svg
      viewBox="0 0 50 37"
      height={37 * (props.size ?? 1)}
      width={50 * (props.size ?? 1)}
      className={props.className}
    >
      <path
        fill={props.fill}
        d="M28.7029 18.9259C28.7029 18.9259 16.6895 21.2639 14.3515 33.2773C14.3515 33.2773 12.0134 21.2639 0 18.9259C12.0134 16.5878 14.3515 4.57447 14.3515 4.57439C16.6895 16.5878 28.7029 18.9259 28.7029 18.9259ZM42.2049 4C42.2049 4 40.935 10.5252 34.4098 11.7952C40.935 13.0651 42.2049 19.5902 42.2049 19.5902C43.4748 13.0651 50 11.7952 50 11.7952C50 11.7952 43.4749 10.5252 42.2049 4ZM36.6929 23.5733C36.6929 23.5733 35.8072 28.1245 31.2559 29.0103C35.8072 29.8961 36.6929 34.4473 36.6929 34.4473C37.5787 29.8961 42.1299 29.0103 42.1299 29.0103C42.1299 29.0103 37.5787 28.1245 36.6929 23.5733Z"
      />
    </svg>
  );
};
