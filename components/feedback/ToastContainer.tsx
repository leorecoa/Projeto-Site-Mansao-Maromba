import React from 'react'
import { useToast } from '../../store/useToast'
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'

export function ToastContainer() {
    const { toasts, removeToast } = useToast()

    if (toasts.length === 0) return null

    return (
        <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className="pointer-events-auto flex items-center gap-3 min-w-[300px] p-4 rounded-xl shadow-2xl animate-in slide-in-from-right fade-in duration-300 bg-[#111] border border-white/10 text-white"
                >
                    {toast.type === 'success' && <CheckCircle className="text-yellow-400" size={20} />}
                    {toast.type === 'error' && <AlertCircle className="text-red-500" size={20} />}
                    {toast.type === 'info' && <Info className="text-blue-500" size={20} />}

                    <p className="text-sm font-bold font-syncopate flex-1">{toast.message}</p>

                    <button
                        onClick={() => removeToast(toast.id)}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <X size={16} />
                    </button>
                </div>
            ))}
        </div>
    )
}