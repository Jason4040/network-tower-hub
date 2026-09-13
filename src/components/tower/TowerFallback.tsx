export default function TowerFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <svg
        viewBox="0 0 220 460"
        role="img"
        aria-label="Lattice communications tower with red and white bands, dishes and antennas"
        className="h-[82%] w-auto max-w-full"
      >
        <g stroke="#c62828" strokeWidth="3" fill="none">
          <path d="M70 430 L110 40 L150 430" />
          <path d="M110 40 L110 18" stroke="#8d8982" strokeWidth="2" />
        </g>
        {Array.from({ length: 14 }).map((_, i) => {
          const t = i / 14;
          const y = 40 + t * 390;
          const w = 6 + t * 34;
          const red = i % 2 === 0;
          return (
            <g key={i} stroke={red ? "#c62828" : "#efeae3"} strokeWidth="1.6">
              <path d={`M${110 - w} ${y} H${110 + w}`} />
              <path d={`M${110 - w} ${y} L${110 + w} ${y + 28}`} />
              <path d={`M${110 + w} ${y} L${110 - w} ${y + 28}`} />
            </g>
          );
        })}
        <ellipse cx="148" cy="120" rx="20" ry="11" fill="none" stroke="#d8d4cc" strokeWidth="2" />
        <ellipse cx="72" cy="190" rx="24" ry="13" fill="none" stroke="#d8d4cc" strokeWidth="2" />
        <rect x="128" y="58" width="10" height="28" fill="#f0ece6" />
        <rect x="82" y="62" width="10" height="28" fill="#f0ece6" />
        <circle cx="110" cy="14" r="5" fill="#ff2d2d" />
        <rect x="48" y="428" width="124" height="8" fill="#4a4743" />
      </svg>
    </div>
  );
}
