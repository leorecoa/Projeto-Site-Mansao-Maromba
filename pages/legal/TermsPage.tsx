import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function TermsPage() {
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

        <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">Termos de Uso</h1>

        <div className="space-y-6 text-gray-300 leading-relaxed">
          <section className="bg-zinc-900 p-6 rounded-xl border border-white/10">
            <h2 className="text-xl font-bold text-white mb-4">1. Aceitação dos Termos</h2>
            <p>
              Ao acessar e usar o site da Mansão Maromba, você concorda em cumprir e ficar vinculado
              aos seguintes termos e condições de uso. Se você não concordar com qualquer parte
              destes termos, você não deve usar nosso site.
            </p>
          </section>

          <section className="bg-zinc-900 p-6 rounded-xl border border-white/10">
            <h2 className="text-xl font-bold text-white mb-4">2. Uso do Site</h2>
            <p>
              Você concorda em usar o site apenas para fins legais e de uma maneira que não infrinja
              os direitos de, restrinja ou iniba o uso e aproveitamento do site por qualquer
              terceiro. É proibido qualquer comportamento que possa danificar, desativar ou
              sobrecarregar o site.
            </p>
          </section>

          <section className="bg-zinc-900 p-6 rounded-xl border border-white/10">
            <h2 className="text-xl font-bold text-white mb-4">3. Propriedade Intelectual</h2>
            <p>
              Todo o conteúdo incluído neste site, como texto, gráficos, logotipos, ícones, imagens,
              clipes de áudio, downloads digitais e compilações de dados, é propriedade da Mansão
              Maromba ou de seus fornecedores de conteúdo e protegido pelas leis de direitos
              autorais.
            </p>
          </section>

          <section className="bg-zinc-900 p-6 rounded-xl border border-white/10">
            <h2 className="text-xl font-bold text-white mb-4">4. Contas de Usuário</h2>
            <p>
              Se você criar uma conta no site, você é responsável por manter a confidencialidade de
              sua conta e senha e por restringir o acesso ao seu computador. Você concorda em
              aceitar a responsabilidade por todas as atividades que ocorram sob sua conta ou senha.
            </p>
          </section>

          <section className="bg-zinc-900 p-6 rounded-xl border border-white/10">
            <h2 className="text-xl font-bold text-white mb-4">5. Compras e Pagamentos</h2>
            <p>
              Ao realizar uma compra, você concorda em fornecer informações verdadeiras, precisas e
              completas. Reservamo-nos o direito de recusar ou cancelar pedidos a nosso critério
              exclusivo, incluindo por motivos de disponibilidade de produto, erros na descrição ou
              preço do produto, ou erro no seu pedido.
            </p>
          </section>

          <section className="bg-zinc-900 p-6 rounded-xl border border-white/10">
            <h2 className="text-xl font-bold text-white mb-4">6. Limitação de Responsabilidade</h2>
            <p>
              A Mansão Maromba não será responsável por quaisquer danos diretos, indiretos,
              incidentais, punitivos ou consequentes decorrentes do uso deste site ou de qualquer
              produto adquirido através dele.
            </p>
          </section>

          <section className="bg-zinc-900 p-6 rounded-xl border border-white/10">
            <h2 className="text-xl font-bold text-white mb-4">7. Alterações nos Termos</h2>
            <p>
              Reservamo-nos o direito de fazer alterações em nosso site, políticas e nestes Termos
              de Uso a qualquer momento. O uso continuado do site após tais alterações constitui sua
              aceitação dos novos termos.
            </p>
          </section>

          <section className="bg-zinc-900 p-6 rounded-xl border border-white/10">
            <h2 className="text-xl font-bold text-white mb-4">8. Contato</h2>
            <p>
              Se você tiver alguma dúvida sobre estes Termos de Uso, entre em contato conosco
              através dos canais de atendimento disponíveis no site ou pelo email
              suporte@mansaomaromba.com.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
