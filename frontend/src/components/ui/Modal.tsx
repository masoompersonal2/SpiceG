export function Modal({ isOpen, title, desc, onConfirm, onCancel, confirmText = "Confirm", isDestructive = false }: any) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl p-8 max-w-sm w-full mx-4 shadow-2xl animate-in zoom-in-95 duration-200">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-500 mb-8">{desc}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-full font-bold transition-colors">Cancel</button>
          <button onClick={onConfirm} className={`flex-1 py-3 rounded-full font-bold transition-colors ${isDestructive ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-[#B2E624] hover:bg-[#a0d21d] text-black'}`}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
