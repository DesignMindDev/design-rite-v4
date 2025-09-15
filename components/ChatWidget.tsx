'use client'

export default function ChatWidget() {
  return (
    <div className="fixed bottom-5 right-5 z-[999999]">
      <button className="w-16 h-16 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full shadow-lg hover:scale-110 transition-all flex items-center justify-center">
        <span className="text-white text-2xl">💬</span>
      </button>
    </div>
  )
}