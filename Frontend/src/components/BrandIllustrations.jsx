function SvgWrap({ children, className = "", viewBox = "0 0 24 24" }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox={viewBox}
      xmlns="http://www.w3.org/2000/svg"
    >
      {children}
    </svg>
  );
}

export function MobileIcon({ className = "h-7 w-7" }) {
  return (
    <SvgWrap className={className}>
      <rect x="7" y="2.75" width="10" height="18.5" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M10 6.5H14" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
      <circle cx="12" cy="17.5" r="1" fill="currentColor" />
    </SvgWrap>
  );
}

export function FingerprintIcon({ className = "h-7 w-7" }) {
  return (
    <SvgWrap className={className}>
      <path d="M12 4.5C8.962 4.5 6.5 6.962 6.5 10V12.25" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
      <path d="M12 7C10.067 7 8.5 8.567 8.5 10.5V12.75" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
      <path d="M12 9.5C11.172 9.5 10.5 10.172 10.5 11V13.75" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
      <path d="M15.5 9.5V11.75C15.5 15.064 13.948 18.187 11.3 20.2" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
      <path d="M18 10.25V11.5C18 16.162 15.917 20.08 12.75 22" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
    </SvgWrap>
  );
}

export function QrIcon({ className = "h-7 w-7" }) {
  return (
    <SvgWrap className={className}>
      <rect x="3.5" y="3.5" width="6" height="6" rx="1.2" stroke="currentColor" strokeWidth="1.8" />
      <rect x="14.5" y="3.5" width="6" height="6" rx="1.2" stroke="currentColor" strokeWidth="1.8" />
      <rect x="3.5" y="14.5" width="6" height="6" rx="1.2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M15 15H17V17H15V15Z" fill="currentColor" />
      <path d="M18.5 18.5H20.5V20.5H18.5V18.5Z" fill="currentColor" />
      <path d="M15 19H17V20.5H15V19Z" fill="currentColor" />
      <path d="M18.5 14.5H20.5V17H18.5V14.5Z" fill="currentColor" />
    </SvgWrap>
  );
}

export function DatabaseIcon({ className = "h-7 w-7" }) {
  return (
    <SvgWrap className={className}>
      <ellipse cx="12" cy="5.5" rx="6.5" ry="3" stroke="currentColor" strokeWidth="1.8" />
      <path d="M5.5 5.5V12C5.5 13.657 8.41 15 12 15C15.59 15 18.5 13.657 18.5 12V5.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M5.5 12V18.5C5.5 20.157 8.41 21.5 12 21.5C15.59 21.5 18.5 20.157 18.5 18.5V12" stroke="currentColor" strokeWidth="1.8" />
    </SvgWrap>
  );
}

export function SchoolIcon({ className = "h-7 w-7" }) {
  return (
    <SvgWrap className={className}>
      <path d="M3.5 9L12 4L20.5 9L12 14L3.5 9Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.8" />
      <path d="M7 11.5V17.5C7 18.604 9.239 19.5 12 19.5C14.761 19.5 17 18.604 17 17.5V11.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M20.5 9V15" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
    </SvgWrap>
  );
}

export function HealthIcon({ className = "h-7 w-7" }) {
  return (
    <SvgWrap className={className}>
      <path d="M12 20C7 16.85 4.5 13.95 4.5 10.5C4.5 8.015 6.515 6 9 6C10.42 6 11.686 6.66 12.5 7.69C13.314 6.66 14.58 6 16 6C18.485 6 20.5 8.015 20.5 10.5C20.5 13.95 18 16.85 13 20H12Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.8" />
      <path d="M12.5 9.25V14.75" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
      <path d="M9.75 12H15.25" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
    </SvgWrap>
  );
}

export function IdCardIcon({ className = "h-7 w-7" }) {
  return (
    <SvgWrap className={className}>
      <rect x="3.5" y="5.5" width="17" height="13" rx="2.4" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="8.75" cy="12" r="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M13 10H17.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
      <path d="M13 13H17.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
      <path d="M6.5 16C7.2 14.95 8 14.5 8.75 14.5C9.5 14.5 10.3 14.95 11 16" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
    </SvgWrap>
  );
}

export function GovernmentIcon({ className = "h-7 w-7" }) {
  return (
    <SvgWrap className={className}>
      <path d="M3.5 9H20.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
      <path d="M5.5 9V18" stroke="currentColor" strokeWidth="1.8" />
      <path d="M9.5 9V18" stroke="currentColor" strokeWidth="1.8" />
      <path d="M14.5 9V18" stroke="currentColor" strokeWidth="1.8" />
      <path d="M18.5 9V18" stroke="currentColor" strokeWidth="1.8" />
      <path d="M2.5 20H21.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
      <path d="M12 4L20 8H4L12 4Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.8" />
    </SvgWrap>
  );
}

export function ShieldCheckIcon({ className = "h-7 w-7" }) {
  return (
    <SvgWrap className={className}>
      <path d="M12 3.75L18.5 6V11.4C18.5 15.287 16.193 18.807 12.625 20.375L12 20.65L11.375 20.375C7.807 18.807 5.5 15.287 5.5 11.4V6L12 3.75Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.8" />
      <path d="M9 12.2L11 14.2L15 10.2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </SvgWrap>
  );
}

export function MailIcon({ className = "h-6 w-6" }) {
  return (
    <SvgWrap className={className}>
      <rect x="3.5" y="5.5" width="17" height="13" rx="2.4" stroke="currentColor" strokeWidth="1.8" />
      <path d="M4.5 7L12 12.5L19.5 7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </SvgWrap>
  );
}

export function PinIcon({ className = "h-6 w-6" }) {
  return (
    <SvgWrap className={className}>
      <path d="M12 20C15.25 15.9 17.5 12.95 17.5 9.5C17.5 6.462 15.038 4 12 4C8.962 4 6.5 6.462 6.5 9.5C6.5 12.95 8.75 15.9 12 20Z" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="9.5" r="1.9" stroke="currentColor" strokeWidth="1.8" />
    </SvgWrap>
  );
}

export function PhoneIcon({ className = "h-6 w-6" }) {
  return (
    <SvgWrap className={className}>
      <path d="M7.712 4.75H5.9C5.182 4.75 4.6 5.332 4.6 6.05C4.6 13.006 10.244 18.65 17.2 18.65C17.918 18.65 18.5 18.068 18.5 17.35V15.538C18.5 15.021 18.194 14.553 17.72 14.344L14.983 13.141C14.515 12.936 13.97 13.057 13.632 13.442L12.476 14.758C10.513 13.84 8.91 12.237 7.992 10.274L9.308 9.118C9.693 8.78 9.814 8.235 9.609 7.767L8.406 5.03C8.198 4.556 7.73 4.75 7.712 4.75Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.8" />
    </SvgWrap>
  );
}

export function PeopleIllustration({ className = "h-72 w-full" }) {
  return (
    <SvgWrap className={className} viewBox="0 0 640 320">
      <rect x="0" y="0" width="640" height="320" rx="32" fill="url(#bg)" />
      <circle cx="510" cy="82" r="52" fill="#D6F7E6" opacity="0.55" />
      <circle cx="138" cy="70" r="36" fill="#FFFFFF" opacity="0.12" />
      <path d="M92 262C92 214.056 130.856 175.2 178.8 175.2H229.2C277.144 175.2 316 214.056 316 262V288H92V262Z" fill="#163860" opacity="0.9" />
      <circle cx="204" cy="132" r="45" fill="#8E5C43" />
      <path d="M172 120C172 95.699 191.699 76 216 76H219C243.301 76 263 95.699 263 120V127H172V120Z" fill="#112D4D" />
      <path d="M324 256C324 219.549 353.549 190 390 190H430C466.451 190 496 219.549 496 256V288H324V256Z" fill="#1DA97C" opacity="0.82" />
      <circle cx="408" cy="154" r="38" fill="#A66E50" />
      <path d="M381 145C381 124.013 398.013 107 419 107H420C440.987 107 458 124.013 458 145V150H381V145Z" fill="#173F6F" />
      <rect x="418" y="208" width="114" height="68" rx="20" fill="#FFFFFF" opacity="0.9" />
      <path d="M449 226H501" stroke="#173F6F" strokeLinecap="round" strokeWidth="10" />
      <path d="M449 246H521" stroke="#D7E5F3" strokeLinecap="round" strokeWidth="10" />
      <path d="M449 264H489" stroke="#D7E5F3" strokeLinecap="round" strokeWidth="10" />
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="640" y2="320" gradientUnits="userSpaceOnUse">
          <stop stopColor="#8B6948" />
          <stop offset="1" stopColor="#2B4F67" />
        </linearGradient>
      </defs>
    </SvgWrap>
  );
}
