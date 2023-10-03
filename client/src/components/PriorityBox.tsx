import { Priority } from "../types";

interface PriorityBoxProps {
  priority: Priority;
}

const PriorityBox: React.FC<PriorityBoxProps> = ({ priority }) => {
  let boxColor = "";
  switch (priority) {
    case Priority.Low:
      boxColor = "#0f4c5c";
      break;
    case Priority.Medium:
      boxColor = "#fb8b24";
      break;
    case Priority.High:
      boxColor = "#9a031e";
      break;
    default:
      break;
  }

  return (
    <div
      className="rounded-lg bg-opacity-80 p-1 inline-block"
      style={{
        backgroundColor: boxColor,
        width: "fit-content",
        textAlign: "center",
        padding: "0 8px",
      }}
    >
      <small>{priority}</small>
    </div>
  );
};

export default PriorityBox;
