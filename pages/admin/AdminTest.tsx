import React from 'react';
import { useAuth } from '@/hooks/useAuth';

export default function AdminTestPage() {
    const { user, isAdmin, isAuthenticated, loading, profile } = useAuth();

    return (
        <div className="min-h-screen bg-black pt-24 pb-12 px-4">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-8">🧪 Admin Test Page</h1>
                
                <div className="bg-zinc-900 p-6 rounded-lg border border-white/10 space-y-4">
                    <div>
                        <p className="text-gray-400">Loading:</p>
                        <p className="text-white font-mono">{loading ? 'true ⏳' : 'false ✅'}</p>
                    </div>
                    
                    <div>
                        <p className="text-gray-400">Authenticated:</p>
                        <p className="text-white font-mono">{isAuthenticated ? 'true ✅' : 'false ❌'}</p>
                    </div>
                    
                    <div>
                        <p className="text-gray-400">Is Admin:</p>
                        <p className="text-white font-mono">{isAdmin ? 'true ✅' : 'false ❌'}</p>
                    </div>
                    
                    <div>
                        <p className="text-gray-400">User Email:</p>
                        <p className="text-white font-mono">{user?.email || 'null'}</p>
                    </div>
                    
                    <div>
                        <p className="text-gray-400">Profile Role:</p>
                        <p className="text-white font-mono">{profile?.role || 'null'}</p>
                    </div>
                    
                    <div>
                        <p className="text-gray-400">User ID:</p>
                        <p className="text-white font-mono text-xs">{user?.id || 'null'}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
