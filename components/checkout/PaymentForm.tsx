import { useState } from 'react';
// Utilizando caminho relativo para garantir a resolução do módulo sem depender de aliases
import { usePayment } from '../../hooks/usePayment';
import { CheckCircle, CreditCard, QrCode, FileText, Loader2, AlertCircle } from 'lucide-react';

interface PaymentFormProps {
    orderId: string;
    onSuccess: (paymentId?: string) => void;
}

type PaymentMethod = 'credit_card' | 'pix' | 'boleto';

export function PaymentForm({ orderId, onSuccess }: PaymentFormProps) {
    const { processPayment, loading, error } = usePayment();
    const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('credit_card');
    const [pixCode, setPixCode] = useState<string | null>(null);

    const handlePayment = async () => {
        const result = await processPayment(orderId, selectedMethod);

        if (result.success) {
            if (selectedMethod === 'pix' && result.qrCode) {
                // Se for PIX, mostramos o QR Code e não finalizamos ainda
                setPixCode(result.qrCode);
            } else {
                // Se for Cartão ou Boleto, finalizamos o fluxo
                onSuccess(result.paymentId);
            }
        }
    };

    // Renderização do Estado de Sucesso do PIX (QR Code)
    if (pixCode) {
        return (
            <div className="flex flex-col items-center justify-center p-6 space-y-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="p-3 bg-green-100 rounded-full">
                    <QrCode className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Pagamento via PIX</h3>
                <p className="text-sm text-gray-500 text-center">
                    Escaneie o QR Code abaixo ou copie o código para pagar.
                </p>

                <div className="p-4 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg">
                    {/* Aqui você usaria uma lib como 'qrcode.react' para gerar a imagem real */}
                    <div className="w-48 h-48 bg-gray-200 flex items-center justify-center text-gray-400 text-xs">
                        [QR Code Imagem Simulada]
                    </div>
                </div>

                <div className="w-full">
                    <label className="text-xs font-semibold text-gray-500 uppercase">Código Copia e Cola</label>
                    <div className="flex mt-1">
                        <input
                            readOnly
                            value={pixCode}
                            className="flex-1 p-2 text-sm bg-gray-100 border rounded-l-md focus:outline-none"
                        />
                        <button
                            onClick={() => navigator.clipboard.writeText(pixCode)}
                            className="px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-r-md hover:bg-gray-700"
                        >
                            Copiar
                        </button>
                    </div>
                </div>

                <button
                    onClick={() => onSuccess()}
                    className="w-full py-3 mt-4 font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                >
                    Já realizei o pagamento
                </button>
            </div>
        );
    }

    // Renderização do Formulário de Seleção
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {/* Opção Cartão */}
                <div
                    onClick={() => setSelectedMethod('credit_card')}
                    className={`cursor-pointer relative flex flex-col items-center p-4 border-2 rounded-xl transition-all ${selectedMethod === 'credit_card'
                        ? 'border-yellow-500 bg-yellow-50/10'
                        : 'border-gray-200 hover:border-gray-300'
                        }`}
                >
                    <CreditCard className={`w-8 h-8 mb-3 ${selectedMethod === 'credit_card' ? 'text-yellow-600' : 'text-gray-400'}`} />
                    <span className="font-medium text-sm">Cartão de Crédito</span>
                    {selectedMethod === 'credit_card' && <CheckCircle className="absolute top-2 right-2 w-4 h-4 text-yellow-500" />}
                </div>

                {/* Opção PIX */}
                <div
                    onClick={() => setSelectedMethod('pix')}
                    className={`cursor-pointer relative flex flex-col items-center p-4 border-2 rounded-xl transition-all ${selectedMethod === 'pix'
                        ? 'border-green-500 bg-green-50/10'
                        : 'border-gray-200 hover:border-gray-300'
                        }`}
                >
                    <QrCode className={`w-8 h-8 mb-3 ${selectedMethod === 'pix' ? 'text-green-600' : 'text-gray-400'}`} />
                    <span className="font-medium text-sm">PIX (Instantâneo)</span>
                    {selectedMethod === 'pix' && <CheckCircle className="absolute top-2 right-2 w-4 h-4 text-green-500" />}
                </div>

                {/* Opção Boleto */}
                <div
                    onClick={() => setSelectedMethod('boleto')}
                    className={`cursor-pointer relative flex flex-col items-center p-4 border-2 rounded-xl transition-all ${selectedMethod === 'boleto'
                        ? 'border-blue-500 bg-blue-50/10'
                        : 'border-gray-200 hover:border-gray-300'
                        }`}
                >
                    <FileText className={`w-8 h-8 mb-3 ${selectedMethod === 'boleto' ? 'text-blue-600' : 'text-gray-400'}`} />
                    <span className="font-medium text-sm">Boleto Bancário</span>
                    {selectedMethod === 'boleto' && <CheckCircle className="absolute top-2 right-2 w-4 h-4 text-blue-500" />}
                </div>
            </div>

            {/* Exibição de Erros */}
            {error && (
                <div className="flex items-center p-4 text-red-800 bg-red-50 rounded-lg">
                    <AlertCircle className="w-5 h-5 mr-2" />
                    <span className="text-sm font-medium">{error}</span>
                </div>
            )}

            {/* Botão de Pagamento */}
            <button
                onClick={handlePayment}
                disabled={loading}
                className="w-full flex items-center justify-center py-4 text-lg font-bold text-white bg-black rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
                {loading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                    `Pagar com ${selectedMethod === 'credit_card' ? 'Cartão' : selectedMethod === 'pix' ? 'PIX' : 'Boleto'}`
                )}
            </button>
        </div>
    );
}