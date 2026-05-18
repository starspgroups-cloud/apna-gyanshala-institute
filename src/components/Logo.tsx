import logo from "../assets/apna-gyanshala-logo-transparent.png";

interface LogoProps {
  className?: string;
  size?: number;
}

export default function Logo({
  className = "",
  size = 58,
}: LogoProps) {
  return (
    <div
      className={`relative flex items-center justify-center shrink-0 ${className}`}
      style={{
        width: size,
        height: size,
      }}
    >
      {/* Glow */}
      <div
        className="absolute inset-0 rounded-full blur-md opacity-40"
        style={{
          background:
            "conic-gradient(from 0deg, #f59e0b, #4f46e5, #7c3aed, #06b6d4, #f59e0b)",
        }}
      />

      {/* Ring */}
      <div
        className="absolute rounded-full"
        style={{
          width: size * 0.98,
          height: size * 0.98,
          border: "2px solid rgba(255,255,255,0.25)",
          boxShadow:
            "0 0 10px rgba(79,70,229,0.25), inset 0 0 10px rgba(245,158,11,0.18)",
        }}
      />

      {/* Logo */}
      <div
        className="relative z-10 flex items-center justify-center rounded-full bg-white overflow-hidden"
        style={{
          width: size * 0.92,
          height: size * 0.92,
        }}
      >
        <img
          src={logo}
          alt="Apna Gyanshala"
          className="object-contain rounded-full"
          style={{
            width: "88%",
            height: "88%",
          }}
        />
      </div>
    </div>
  );
}