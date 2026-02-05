import React, { useState } from 'react';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (amount: number) => void;
}

const DepositModal: React.FC<DepositModalProps> = ({
  isOpen,
  onClose,
  onConfirm
}) => {
  const [amount, setAmount] = useState<number>(0);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (amount <= 0) {
      alert('Informe um valor válido');
      return;
    }

    onConfirm(amount);
    setAmount(0);
    onClose();
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <h2>Depositar saldo</h2>

        <input
          type="number"
          min={1}
          placeholder="Valor do depósito"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          style={inputStyle}
        />

        <div style={actionsStyle}>
          <button onClick={onClose} style={cancelStyle}>
            Cancelar
          </button>
          <button onClick={handleConfirm} style={confirmStyle}>
            Depositar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DepositModal;

/* ===== estilos simples ===== */

const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.6)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 999
};

const modalStyle: React.CSSProperties = {
  background: '#fff',
  padding: '24px',
  borderRadius: '12px',
  width: '320px'
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '8px',
  marginTop: '12px'
};

const actionsStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  marginTop: '20px'
};

const cancelStyle: React.CSSProperties = {
  background: '#ccc',
  padding: '8px 16px',
  borderRadius: '6px',
  border: 'none',
  cursor: 'pointer'
};

const confirmStyle: React.CSSProperties = {
  background: '#e10600',
  color: '#fff',
  padding: '8px 16px',
  borderRadius: '6px',
  border: 'none',
  cursor: 'pointer'
};
