export default function TowerFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <svg
        viewBox="0 0 200 420"
        role="img"
        aria-label="Technical illustration of a lattice communications tower with three support legs, dishes and indicator nodes"
        className="h-[80%] w-auto max-w-full"
      >
        <g stroke="#6b6862" strokeWidth="1.4" fill="none">
          <path d="M100 20 V60" />
          <path d="M78 380 L100 60 L122 380" />
          {Array.from({ length: 12 }).map((_, i) => {
            const t = i / 12;
            const t2 = (i + 1) / 12;
            const y = 60 + t * 320;
            const y2 = 60 + t2 * 320;
            const w = 4 + t * 22;
            const w2 = 4 + t2 * 22;
            return (
              <g key={i} stroke="#4a4844">
                <path d={`M${100 - w} ${y} H${100 + w}`} />
                <path d={`M${100 - w} ${y} L${100 + w2} ${y2}`} />
                <path d={`M${100 + w} ${y} L${100 - w2} ${y2}`} />
              </g>
            );
          })}
          <path d="M100 380 L60 405 M100 380 L140 405 M100 380 L100 408" strokeWidth="2" />
          <path d="M40 408 H160" stroke="#3a3835" strokeWidth="3" />
          <ellipse cx="128" cy="110" rx="18" ry="10" stroke="#8d8a84" />
          <path d="M128 110 L118 122" stroke="#8d8a84" />
          <ellipse cx="70" cy="190" rx="22" ry="12" stroke="#8d8a84" />
          <path d="M70 190 L82 204" stroke="#8d8a84" />
        </g>
        <g fill="#c2551f">
          <circle cx="100" cy="16" r="3.5" />
          <circle cx="112" cy="150" r="2.6" />
          <circle cx="86" cy="230" r="2.6" />
          <circle cx="118" cy="300" r="2.6" />
        </g>
      </svg>
    </div>
  );
}
