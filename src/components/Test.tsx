import { useState, CSSProperties } from "react";

const ImageComponent = ({ url }: { url: string }) => {
  // 初始状态：旋转角度和 objectFit 行为
  const [rotation, setRotation] = useState(0);
  const [objectFit, setObjectFit] =
    useState<CSSProperties["objectFit"]>("contain");

  // 旋转图片
  const rotateImage = () => {
    setRotation((prevRotation) => prevRotation + 90);
  };

  // 切换 objectFit 行为
  const toggleObjectFit = () => {
    setObjectFit((prevFit) => (prevFit === "contain" ? "cover" : "contain"));
  };

  return (
    <div className="absolute  top-80" style={{ textAlign: "center" }}>
      <div
        style={{
          width: "62mm",
          height: "88mm",
          overflow: "hidden",
          position: "relative",
          border: "1px solid #ccc",
          margin: "auto",
          transform: `rotate(${rotation}deg)`,
        }}
      >
        <img
          src={url} // 替换成实际的图片路径
          alt="displayed image"
          style={{
            width: "62mm",
            height: "88mm",
            // width: "100%",
            // height: "100%",
            objectFit: objectFit,
            // transform: `rotate(${rotation}deg)`,
            transition: "transform 0.5s, object-fit 0.5s",
          }}
        />
      </div>

      <div style={{ marginTop: "20px" }}>
        <button onClick={rotateImage} style={buttonStyle}>
          旋转图片
        </button>
        <button onClick={toggleObjectFit} style={buttonStyle}>
          切换 objectFit（{objectFit === "contain" ? "contain" : "cover"}）
        </button>
      </div>
    </div>
  );
};

// 按钮样式
const buttonStyle = {
  margin: "0 10px",
  padding: "10px 20px",
  fontSize: "16px",
  cursor: "pointer",
  borderRadius: "5px",
  border: "1px solid #0070f3",
  backgroundColor: "#0070f3",
  color: "#ffffff",
};

export default ImageComponent;
