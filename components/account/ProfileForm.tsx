import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/services/supabase';
import { Loader2, Save } from 'lucide-react';
import { useToast } from '@/store/useToast';
import { logError } from '@/utils/logger';

interface ProfileFormData {
  full_name: string;
  phone: string;
  address_street: string;
  address_number: string;
  address_neighborhood: string;
  address_city: string;
  address_state: string;
  address_zip: string;
}

export default function ProfileForm() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<ProfileFormData>();

  useEffect(() => {
    async function loadProfile() {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('customers')
          .select('*')
          .eq('auth_user_id', user.id)
          .maybeSingle();

        if (error) throw error;
        if (data) reset(data);
      } catch (error) {
        logError('ProfileForm.loadProfile', error);
        addToast('Nao foi possivel carregar seus dados.', 'error');
      }
    }
    loadProfile();
  }, [user, reset, addToast]);

  const onSubmit = async (data: ProfileFormData) => {
    if (!user) return;

    try {
      const { error } = await supabase.from('customers').upsert(
        {
          auth_user_id: user.id,
          email: user.email,
          ...data,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'auth_user_id' }
      );

      if (error) throw error;
      addToast('Perfil atualizado com sucesso!', 'success');
    } catch (error) {
      logError('ProfileForm.onSubmit', error);
      addToast('Nao foi possivel atualizar o perfil.', 'error');
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-zinc-900 p-4 sm:p-6 rounded-xl border border-white/10 space-y-6"
    >
      <h2 className="text-lg sm:text-xl font-bold text-white mb-4">Meus Dados</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="profile-full-name" className="block text-sm text-gray-400 mb-1">
            Nome Completo
          </label>
          <input
            id="profile-full-name"
            autoComplete="name"
            {...register('full_name', { required: 'Nome e obrigatorio' })}
            className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-yellow-400 outline-none"
          />
          {errors.full_name && (
            <span className="text-xs text-red-500">{errors.full_name.message}</span>
          )}
        </div>

        <div>
          <label htmlFor="profile-phone" className="block text-sm text-gray-400 mb-1">
            Telefone
          </label>
          <input
            id="profile-phone"
            autoComplete="tel"
            {...register('phone')}
            className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-yellow-400 outline-none"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full md:w-auto px-6 py-3 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-500 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <>
            <Save className="w-4 h-4" /> Salvar Alteracoes
          </>
        )}
      </button>
    </form>
  );
}
