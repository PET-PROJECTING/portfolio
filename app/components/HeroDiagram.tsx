const introPath = 'path("M420 264 V302")';

const packetPath =
  'path("M420 302 V400 H330 V468 V400 H510 V468 V400 H420 V468 V366 H318 H522 H420 V302")';

export default function HeroDiagram() {
  return (
    <svg
      viewBox="0 0 420 340"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-auto w-full max-w-[420px]"
      aria-hidden="true"
    >
      {/* Connecting paths */}
      <path
        className="hero-diagram-line"
        d="M210 84 V104"
        stroke="rgba(255,255,255,0.55)"
        strokeWidth="1"
        pathLength="1"
        style={{ animationDelay: "0.2s" }}
      />
      <path
        className="hero-diagram-line"
        d="M210 160 V230"
        stroke="rgba(255,255,255,0.55)"
        strokeWidth="1"
        pathLength="1"
        style={{ animationDelay: "0.35s" }}
      />
      <path
        className="hero-diagram-line"
        d="M120 230 H300"
        stroke="rgba(255,255,255,0.45)"
        strokeWidth="1"
        pathLength="1"
        style={{ animationDelay: "0.55s" }}
      />
      <path
        className="hero-diagram-line"
        d="M120 230 V280"
        stroke="rgba(255,255,255,0.45)"
        strokeWidth="1"
        pathLength="1"
        style={{ animationDelay: "0.7s" }}
      />
      <path
        className="hero-diagram-line"
        d="M210 230 V280"
        stroke="rgba(255,255,255,0.45)"
        strokeWidth="1"
        pathLength="1"
        style={{ animationDelay: "0.8s" }}
      />
      <path
        className="hero-diagram-line"
        d="M300 230 V280"
        stroke="rgba(255,255,255,0.45)"
        strokeWidth="1"
        pathLength="1"
        style={{ animationDelay: "0.9s" }}
      />
      <path
        className="hero-diagram-line"
        d="M108 196 H312"
        stroke="rgba(255,255,255,0.35)"
        strokeWidth="1"
        pathLength="1"
        style={{ animationDelay: "0.45s" }}
      />

      {/* Top browser window */}
      <g className="hero-diagram-shape" style={{ animationDelay: "0.15s" }}>
        <rect
          className="hero-diagram-visit hero-diagram-visit-browser"
          x="150"
          y="6"
          width="120"
          height="78"
          rx="4"
          stroke="rgba(255,255,255,0.7)"
          strokeWidth="1.25"
        />
        <circle cx="164" cy="20" r="2.5" fill="rgba(255,255,255,0.55)" />
        <circle cx="174" cy="20" r="2.5" fill="rgba(255,255,255,0.55)" />
        <circle cx="184" cy="20" r="2.5" fill="rgba(255,255,255,0.55)" />
        <line
          x1="158"
          y1="30"
          x2="262"
          y2="30"
          stroke="rgba(255,255,255,0.25)"
          strokeWidth="1"
        />
        <rect
          x="168"
          y="42"
          width="36"
          height="28"
          rx="2"
          stroke="rgba(255,255,255,0.5)"
          strokeWidth="1"
        />
        <rect
          x="214"
          y="42"
          width="36"
          height="28"
          rx="2"
          stroke="rgba(255,255,255,0.5)"
          strokeWidth="1"
        />
      </g>

      {/* Middle code panel */}
      <g className="hero-diagram-shape" style={{ animationDelay: "0.4s" }}>
        <rect
          className="hero-diagram-visit hero-diagram-visit-code"
          x="162"
          y="104"
          width="96"
          height="56"
          rx="3"
          stroke="rgba(255,255,255,0.65)"
          strokeWidth="1.25"
        />
        <text
          x="210"
          y="138"
          textAnchor="middle"
          fill="rgba(255,255,255,0.85)"
          fontFamily="var(--font-ibm-plex-mono), monospace"
          fontSize="18"
        >
          {"</>"}
        </text>
        <rect
          className="hero-code-loader"
          x="162"
          y="104"
          width="96"
          height="56"
          rx="3"
          pathLength="1"
        />
      </g>

      {/* Side nodes */}
      <g className="hero-diagram-shape" style={{ animationDelay: "0.5s" }}>
        <rect
          className="hero-diagram-visit hero-diagram-visit-side-left"
          x="48"
          y="176"
          width="60"
          height="40"
          rx="3"
          stroke="rgba(255,255,255,0.55)"
          strokeWidth="1"
        />
        <line
          x1="58"
          y1="190"
          x2="98"
          y2="190"
          stroke="rgba(255,255,255,0.35)"
          strokeWidth="1"
        />
        <line
          x1="58"
          y1="200"
          x2="86"
          y2="200"
          stroke="rgba(255,255,255,0.25)"
          strokeWidth="1"
        />
      </g>
      <g className="hero-diagram-shape" style={{ animationDelay: "0.55s" }}>
        <rect
          className="hero-diagram-visit hero-diagram-visit-side-right"
          x="312"
          y="176"
          width="60"
          height="40"
          rx="3"
          stroke="rgba(255,255,255,0.55)"
          strokeWidth="1"
        />
        <line
          x1="322"
          y1="190"
          x2="362"
          y2="190"
          stroke="rgba(255,255,255,0.35)"
          strokeWidth="1"
        />
        <line
          x1="322"
          y1="200"
          x2="350"
          y2="200"
          stroke="rgba(255,255,255,0.25)"
          strokeWidth="1"
        />
      </g>

      {/* Hub */}
      <g className="hero-diagram-shape" style={{ animationDelay: "0.65s" }}>
        <circle
          className="hero-diagram-visit hero-diagram-visit-hub"
          cx="210"
          cy="230"
          r="10"
          fill="var(--background)"
          stroke="rgba(255,255,255,0.7)"
          strokeWidth="1.25"
        />
        <circle cx="210" cy="230" r="3" fill="rgba(255,255,255,0.8)" />
      </g>

      {/* Bottom leaves */}
      <g className="hero-diagram-shape" style={{ animationDelay: "0.85s" }}>
        <rect
          className="hero-diagram-visit hero-diagram-visit-leaf-left"
          x="92"
          y="280"
          width="56"
          height="36"
          rx="3"
          stroke="rgba(255,255,255,0.5)"
          strokeWidth="1"
        />
      </g>
      <g className="hero-diagram-shape" style={{ animationDelay: "0.95s" }}>
        <rect
          className="hero-diagram-visit hero-diagram-visit-leaf-center"
          x="182"
          y="280"
          width="56"
          height="36"
          rx="3"
          stroke="rgba(255,255,255,0.5)"
          strokeWidth="1"
        />
      </g>
      <g className="hero-diagram-shape" style={{ animationDelay: "1.05s" }}>
        <rect
          className="hero-diagram-visit hero-diagram-visit-leaf-right"
          x="272"
          y="280"
          width="56"
          height="36"
          rx="3"
          stroke="rgba(255,255,255,0.5)"
          strokeWidth="1"
        />
      </g>

      {/* Intro runs from the top window into the code block. The loop then starts there. */}
      <rect
        className="hero-diagram-node hero-diagram-node-intro"
        x="-6"
        y="-6"
        width="12"
        height="12"
        fill="var(--accent)"
        style={{ offsetPath: introPath }}
      />
      <rect
        className="hero-diagram-node hero-diagram-node-main"
        x="-6"
        y="-6"
        width="12"
        height="12"
        fill="var(--accent)"
        style={{ offsetPath: packetPath }}
      />
    </svg>
  );
}
