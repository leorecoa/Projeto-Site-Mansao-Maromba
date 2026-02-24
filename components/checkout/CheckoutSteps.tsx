import React from 'react';
import { ShoppingCart, User, CreditCard, Check } from 'lucide-react';

interface CheckoutStepsProps {
  currentStep: 'cart' | 'identification' | 'payment';
}

export default function CheckoutSteps({ currentStep }: CheckoutStepsProps) {
  const steps = [
    { id: 'cart', label: 'Carrinho', icon: ShoppingCart },
    { id: 'identification', label: 'Identificação', icon: User },
    { id: 'payment', label: 'Pagamento', icon: CreditCard },
  ];

  const getCurrentStepIndex = () => steps.findIndex((s) => s.id === currentStep);
  const currentStepIndex = getCurrentStepIndex();

  return (
    <div className="w-full max-w-3xl mx-auto mb-8">
      <div className="relative flex justify-between items-center">
        {/* Linha de conexão */}
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white/10 -z-10" />
        <div
          className="absolute top-1/2 left-0 h-0.5 bg-yellow-400 -z-10 transition-all duration-500"
          style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step, index) => {
          const isCompleted = index < currentStepIndex;
          const isCurrent = index === currentStepIndex;
          const Icon = isCompleted ? Check : step.icon;

          return (
            <div key={step.id} className="flex flex-col items-center gap-2 bg-black px-2">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  isCompleted || isCurrent
                    ? 'bg-yellow-400 border-yellow-400 text-black'
                    : 'bg-zinc-900 border-white/20 text-gray-500'
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span
                className={`text-xs font-bold uppercase tracking-wider ${
                  isCurrent ? 'text-yellow-400' : isCompleted ? 'text-white' : 'text-gray-600'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
