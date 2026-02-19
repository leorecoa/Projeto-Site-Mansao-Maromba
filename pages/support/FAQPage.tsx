import React, { useState } from 'react';
import { ArrowLeft, ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface FAQItem {
    question: string;
    answer: string;
}

interface FAQCategory {
    title: string;
    items: FAQItem[];
}

const FAQ_DATA: FAQCategory[] = [
    {
        title: 'Pedidos e Entrega',
        items: [
            {
                question: 'Qual o prazo de entrega?',
                answer: 'O prazo de entrega varia de acordo com a sua região e a forma de envio escolhida. Você pode simular o prazo e o valor do frete no carrinho de compras antes de finalizar o pedido.'
            },
            {
                question: 'Como rastrear meu pedido?',
                answer: 'Assim que seu pedido for enviado, você receberá um e-mail com o código de rastreio. Você também pode acompanhar o status do seu pedido na área "Minha Conta" em nosso site.'
            },
            {
                question: 'Posso alterar meu endereço de entrega?',
                answer: 'Se o pedido ainda não tiver sido enviado, entre em contato conosco imediatamente através do nosso suporte. Caso já tenha sido despachado, não será possível alterar o endereço.'
            }
        ]
    },
    {
        title: 'Pagamentos',
        items: [
            {
                question: 'Quais as formas de pagamento aceitas?',
                answer: 'Aceitamos pagamentos via Cartão de Crédito (em até 12x), PIX (com aprovação imediata) e Boleto Bancário.'
            },
            {
                question: 'É seguro comprar no site?',
                answer: 'Sim! Nosso site utiliza tecnologia de criptografia SSL para proteger seus dados. Além disso, não armazenamos os dados do seu cartão de crédito, o processamento é feito diretamente pela operadora de pagamentos.'
            }
        ]
    },
    {
        title: 'Trocas e Devoluções',
        items: [
            {
                question: 'Como faço para trocar um produto?',
                answer: 'Você tem até 7 dias corridos após o recebimento para solicitar a troca ou devolução por arrependimento. Em caso de defeito, o prazo é de 30 dias. Entre em contato com nosso suporte para iniciar o processo.'
            },
            {
                question: 'Recebi um produto errado ou danificado, o que fazer?',
                answer: 'Pedimos desculpas pelo inconveniente! Por favor, entre em contato conosco enviando fotos do produto recebido para que possamos resolver o problema o mais rápido possível.'
            }
        ]
    }
];

export default function FAQPage() {
    const navigate = useNavigate();
    const [openIndex, setOpenIndex] = useState<string | null>(null);

    const toggleAccordion = (index: string) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="min-h-screen bg-black pt-24 pb-12 px-4">
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Voltar
                </button>

                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-zinc-900 rounded-full mb-4 border border-white/10">
                        <HelpCircle className="w-8 h-8 text-yellow-400" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Perguntas Frequentes</h1>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Encontre respostas para as dúvidas mais comuns sobre nossos produtos e serviços.
                    </p>
                </div>

                <div className="space-y-8">
                    {FAQ_DATA.map((category, catIndex) => (
                        <div key={catIndex} className="bg-zinc-900 rounded-xl border border-white/10 overflow-hidden">
                            <div className="p-6 border-b border-white/10 bg-zinc-800/50">
                                <h2 className="text-xl font-bold text-white">{category.title}</h2>
                            </div>
                            <div className="divide-y divide-white/10">
                                {category.items.map((item, itemIndex) => {
                                    const uniqueId = `${catIndex}-${itemIndex}`;
                                    const isOpen = openIndex === uniqueId;

                                    return (
                                        <div key={itemIndex} className="bg-zinc-900">
                                            <button
                                                onClick={() => toggleAccordion(uniqueId)}
                                                className="w-full px-6 py-4 flex justify-between items-center text-left hover:bg-white/5 transition-colors focus:outline-none"
                                            >
                                                <span className="font-medium text-white pr-8">{item.question}</span>
                                                {isOpen ? <ChevronUp className="w-5 h-5 text-yellow-400 flex-shrink-0" /> : <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />}
                                            </button>
                                            {isOpen && (
                                                <div className="px-6 pb-6 text-gray-300 leading-relaxed animate-fade-in">
                                                    {item.answer}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-center bg-zinc-900 p-8 rounded-xl border border-white/10">
                    <h3 className="text-xl font-bold text-white mb-2">Ainda tem dúvidas?</h3>
                    <p className="text-gray-400 mb-6">Nossa equipe de suporte está pronta para te ajudar.</p>
                    <a
                        href="mailto:suporte@mansaomaromba.com"
                        className="inline-flex items-center justify-center px-6 py-3 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-500 transition-colors"
                    >
                        Fale Conosco
                    </a>
                </div>
            </div>
        </div>
    );
}