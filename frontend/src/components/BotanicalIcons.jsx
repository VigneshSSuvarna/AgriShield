export function BrandLeafMark({ className = 'h-6 w-6' }) {
  return (
    <svg
      viewBox="0 0 28 28"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M14 3.5C8.5 5.5 5 10.5 5 16.5C5 20.5 7.5 23.5 14 24.5C20.5 23.5 23 20.5 23 16.5C23 10.5 19.5 5.5 14 3.5Z" />
      <path d="M14 24.5V9.5" />
      <path d="M14 15.5L18.5 12" />
      <path d="M14 18.5L9.5 15" />
    </svg>
  )
}

export function HeroBotanicalSpecimen({ className = 'w-full h-auto' }) {
  return (
    <svg
      viewBox="0 0 320 340"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Specimen frame registration marks */}
      <path d="M16 28V16H28" stroke="#B8AF9C" strokeWidth="1.25" />
      <path d="M304 28V16H292" stroke="#B8AF9C" strokeWidth="1.25" />
      <path d="M16 312V324H28" stroke="#B8AF9C" strokeWidth="1.25" />
      <path d="M304 312V324H292" stroke="#B8AF9C" strokeWidth="1.25" />

      {/* Subtle botanical grid scale */}
      <line x1="40" y1="288" x2="280" y2="288" stroke="#D6CFC0" strokeWidth="1" />
      <line x1="80" y1="284" x2="80" y2="292" stroke="#B8AF9C" strokeWidth="1" />
      <line x1="160" y1="282" x2="160" y2="294" stroke="#B8AF9C" strokeWidth="1" />
      <line x1="240" y1="284" x2="240" y2="292" stroke="#B8AF9C" strokeWidth="1" />

      {/* Main botanical leaf silhouette */}
      <path
        d="M160 52C116 86 92 138 96 190C99 224 124 248 160 256C196 248 221 224 224 190C228 138 204 86 160 52Z"
        fill="#EFE9DC"
        stroke="#1F2A1E"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />

      {/* Midrib and petiole */}
      <path
        d="M160 54V276"
        stroke="#1F2A1E"
        strokeWidth="1.6"
        strokeLinecap="round"
      />

      {/* Lateral leaf veins */}
      <path d="M160 102C142 96 126 102 115 114" stroke="#3B6E4C" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M160 138C136 130 115 138 102 152" stroke="#3B6E4C" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M160 176C136 170 116 178 103 192" stroke="#3B6E4C" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M160 212C142 208 126 214 116 226" stroke="#3B6E4C" strokeWidth="1.3" strokeLinecap="round" />

      <path d="M160 102C178 96 194 102 205 114" stroke="#3B6E4C" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M160 138C184 130 205 138 218 152" stroke="#3B6E4C" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M160 176C184 170 204 178 217 192" stroke="#3B6E4C" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M160 212C178 208 194 214 204 226" stroke="#3B6E4C" strokeWidth="1.3" strokeLinecap="round" />

      {/* Diagnostic callout reticle */}
      <circle
        cx="196"
        cy="162"
        r="18"
        stroke="#B8502B"
        strokeWidth="1.5"
        strokeDasharray="3 3"
      />
      <circle cx="196" cy="162" r="3" fill="#B8502B" />
      <path d="M214 162H252" stroke="#B8502B" strokeWidth="1.25" />
    </svg>
  )
}

export function CropIllustration({ crop, className = 'h-12 w-12' }) {
  if (crop === 'Tomato') {
    return (
      <svg
        viewBox="0 0 48 48"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        aria-hidden="true"
      >
        <path d="M24 14C15.5 14 10 20 10 27.5C10 35 15.8 40 24 40C32.2 40 38 35 38 27.5C38 20 32.5 14 24 14Z" />
        <path d="M24 14V8" />
        <path d="M24 14C20 11 16 12 14 15" />
        <path d="M24 14C28 11 32 12 34 15" />
        <path d="M24 14C22 17 20 18 18 18" />
        <path d="M24 14C26 17 28 18 30 18" />
      </svg>
    )
  }

  if (crop === 'Potato') {
    return (
      <svg
        viewBox="0 0 48 48"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        aria-hidden="true"
      >
        <path d="M18 13C24 10 34 12 37 19C40 26 36 35 28 37C20 39 11 35 10 27C9 20 13 15 18 13Z" />
        <circle cx="19" cy="21" r="1" fill="currentColor" stroke="none" />
        <circle cx="28" cy="20" r="1" fill="currentColor" stroke="none" />
        <circle cx="25" cy="29" r="1" fill="currentColor" stroke="none" />
        <path d="M15 30C16 31 17.5 31.5 19 31.5" />
      </svg>
    )
  }

  // Corn
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M24 8C28.5 8 31 14 31 23C31 30 28 36 24 38C20 36 17 30 17 23C17 14 19.5 8 24 8Z" />
      <path d="M17 22C13 24 11 30 13 38C17 39 20 38 24 38" />
      <path d="M31 22C35 24 37 30 35 38C31 39 28 38 24 38" />
      <path d="M18 17H30" />
      <path d="M17.5 23H30.5" />
      <path d="M24 8V38" />
    </svg>
  )
}

export function CameraIcon({ className = 'h-7 w-7' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M4 8.5A1.5 1.5 0 0 1 5.5 7H8l1.5-2h5L16 7h2.5A1.5 1.5 0 0 1 20 8.5v9A1.5 1.5 0 0 1 18.5 19h-13A1.5 1.5 0 0 1 4 17.5v-9Z" />
      <circle cx="12" cy="13" r="3.25" />
    </svg>
  )
}

export function UploadIcon({ className = 'h-7 w-7' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 15V4" />
      <path d="M7.5 8.5L12 4l4.5 4.5" />
      <path d="M4 15.5v2.5A1.5 1.5 0 0 0 5.5 19.5h13A1.5 1.5 0 0 0 20 18v-2.5" />
    </svg>
  )
}

export function CheckIcon({ className = 'h-4 w-4' }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M3.5 8.5L6.5 11.5L12.5 4.5" />
    </svg>
  )
}
