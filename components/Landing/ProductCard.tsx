import React from "react";

const ProductCard: React.FC = () => {
  return (
    <div className="w-1/2 h-full flex items-center justify-center pb-10 pl-10">
      <div
        className="relative flex flex-row items-center justify-between h-full w-full"
        style={{
          background: "#f5f0e2",
          borderRadius: 32,
          padding: "28px 24px 28px 28px",
          gap: 16,
        }}
      >
        {/* Left: Text Content */}
        <div
          className="flex flex-col justify-between h-full"
          style={{ flex: 1, gap: 10 }}
        >
          <div>
            <h2
              style={{
                fontSize: 32,
                fontWeight: 700,
                color: "#1b3d1b",
                lineHeight: 1.2,
                marginTop: 45,
              }}
            >
              Garud T50
            </h2>

            <p
              style={{
                fontSize: 15,
                fontWeight: 500,
                color: "#555",
                lineHeight: 1.75,
                margin: "20px 0 0 0",
              }}
            >
              Fully automatic and manual operation
              <br />
              orchard mode variable rate
            </p>
          </div>

          <div
            className="flex items-center gap-0 mt-4"
            style={{ width: "fit-content" }}
          >
            <button
              style={{
                padding: "20px 40px",
                borderRadius: "32px",
                border: "none",
                background: "#1b3d1b",
                color: "#fff",
                fontSize: 16,
                fontWeight: 600,
                cursor: "pointer",
                letterSpacing: "0.01em",
              }}
            >
              Explore More
            </button>
            <button
              style={{
                width: 66,
                height: 66,
                borderRadius: "100%",
                border: "none",
                background: "#1b3d1b",
                color: "#fff",
                fontSize: 16,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg className="ml-2.5" width="36" height="36" viewBox="0 0 24 24" fill="solid" color="#94cd5e">
                <path

                  d="M0 12H19M19 12L13 6M19 12L13 18"
                  stroke="#94cd5e"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Right: Product Image */}
        <div
          style={{
            flexShrink: 0,
            borderRadius: 12,
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          className="w-1/2 h-full"
        >
          <img
            src="./images/Hero_RC_1_.png"
            alt="DJI Remote Controller"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
