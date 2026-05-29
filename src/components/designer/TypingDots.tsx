export default function TypingDots() {
  return (
    <div className="flex justify-start gap-2 my-4">
      <div className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center font-mono text-[13px] font-bold bg-gradient-to-br from-[#c89b3c] to-[#a07a2a] text-[#1a1a1a] border border-[rgba(212,175,55,0.5)] shadow-[0_2px_8px_rgba(199,153,67,0.35)]">
        V
      </div>
      <div className="px-4 py-3 rounded-2xl rounded-bl-[6px] bg-[rgba(255,255,255,0.04)] border-[rgba(255,255,255,0.08)] flex items-center gap-1 min-h-[46px]">
        <style>{`
          @keyframes bounce {
            0%, 60%, 100% { opacity: 0.3; transform: scale(0.8); }
            30% { opacity: 1; transform: scale(1); }
          }
        `}</style>
        <div className="w-1.5 h-1.5 rounded-full bg-verko-muted" style={{ animation: 'bounce 1.4s infinite ease-in-out both' }} />
        <div className="w-1.5 h-1.5 rounded-full bg-verko-muted" style={{ animation: 'bounce 1.4s infinite ease-in-out both', animationDelay: '0.16s' }} />
        <div className="w-1.5 h-1.5 rounded-full bg-verko-muted" style={{ animation: 'bounce 1.4s infinite ease-in-out both', animationDelay: '0.32s' }} />
      </div>
    </div>
  );
}
