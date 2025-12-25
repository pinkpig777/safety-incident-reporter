export function SeverityLabel({ severity }) {
  const value = (severity || "").toLowerCase();

  let labelStyle = {
    padding: "2px 8px",
    borderRadius: "999px",
    fontSize: "0.75rem",
    fontWeight: 600,
    display: "inline-block",
  };

  if (value === "high") {
    labelStyle.border = "1px solid red";
    labelStyle.color = "red";
  } else if (value === "medium") {
    labelStyle.border = "1px solid orange";
    labelStyle.color = "orange";
  } else {
    labelStyle.border = "1px solid gray";
    labelStyle.color = "gray";
  }

  return <span style={labelStyle}>{severity}</span>;
}
