import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PrivacyPage() {
  const navigate = useNavigate();

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

        <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">Política de Privacidade</h1>

        <div className="space-y-6 text-gray-300 leading-relaxed">
          <section className="bg-zinc-900 p-6 rounded-xl border border-white/10">
            <h2 className="text-xl font-bold text-white mb-4">1. Coleta de Informações</h2>
            <p>
              Coletamos informações pessoais que você nos fornece voluntariamente ao criar uma
              conta, fazer um pedido, assinar nossa newsletter ou entrar em contato conosco. Isso
              pode incluir seu nome, endereço de e-mail, endereço de entrega, número de telefone e
              informações de pagamento.
            </p>
          </section>

          <section className="bg-zinc-900 p-6 rounded-xl border border-white/10">
            <h2 className="text-xl font-bold text-white mb-4">2. Uso das Informações</h2>
            <p>
              Usamos suas informações para processar seus pedidos, gerenciar sua conta, enviar
              atualizações sobre o status do pedido, responder a suas perguntas e, se você optar por
              receber, enviar comunicações de marketing. Também usamos dados para melhorar nosso
              site e serviços.
            </p>
          </section>

          <section className="bg-zinc-900 p-6 rounded-xl border border-white/10">
            <h2 className="text-xl font-bold text-white mb-4">
              3. Compartilhamento de Informações
            </h2>
            <p>
              Não vendemos suas informações pessoais a terceiros. Podemos compartilhar seus dados
              com prestadores de serviços confiáveis que nos ajudam a operar nosso site, conduzir
              nossos negócios ou atender você (como processadores de pagamento e empresas de
              entrega), desde que essas partes concordem em manter essas informações confidenciais.
            </p>
          </section>

          <section className="bg-zinc-900 p-6 rounded-xl border border-white/10">
            <h2 className="text-xl font-bold text-white mb-4">4. Segurança dos Dados</h2>
            <p>
              Implementamos uma variedade de medidas de segurança para manter a segurança de suas
              informações pessoais. Seus dados pessoais são contidos em redes seguras e são
              acessíveis apenas por um número limitado de pessoas que têm direitos especiais de
              acesso a tais sistemas.
            </p>
          </section>

          <section className="bg-zinc-900 p-6 rounded-xl border border-white/10">
            <h2 className="text-xl font-bold text-white mb-4">5. Cookies</h2>
            <p>
              Usamos cookies para entender e salvar suas preferências para visitas futuras e
              compilar dados agregados sobre o tráfego e a interação no site, para que possamos
              oferecer melhores experiências e ferramentas no futuro. Você pode optar por desativar
              os cookies nas configurações do seu navegador.
            </p>
          </section>

          <section className="bg-zinc-900 p-6 rounded-xl border border-white/10">
            <h2 className="text-xl font-bold text-white mb-4">6. Seus Direitos</h2>
            <p>
              Você tem o direito de acessar, corrigir ou excluir suas informações pessoais a
              qualquer momento. Você pode fazer isso acessando sua conta no site ou entrando em
              contato conosco diretamente.
            </p>
          </section>

          <section className="bg-zinc-900 p-6 rounded-xl border border-white/10">
            <h2 className="text-xl font-bold text-white mb-4">7. Alterações nesta Política</h2>
            <p>
              Podemos atualizar nossa Política de Privacidade periodicamente. Notificaremos você
              sobre quaisquer alterações publicando a nova Política de Privacidade nesta página.
              Recomendamos que você revise esta Política de Privacidade periodicamente para
              quaisquer alterações.
            </p>
          </section>

          <section className="bg-zinc-900 p-6 rounded-xl border border-white/10">
            <h2 className="text-xl font-bold text-white mb-4">8. Contato</h2>
            <p>
              Se você tiver alguma dúvida sobre esta Política de Privacidade, entre em contato
              conosco pelo email privacidade@mansaomaromba.com.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
