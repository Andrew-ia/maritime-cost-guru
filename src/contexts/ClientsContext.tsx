import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Client } from '@/pages/Clients';

interface ClientsContextType {
  clients: Client[];
  loading: boolean;
  fetchClients: () => Promise<void>;
  createClient: (client: Omit<Client, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<Client | null>;
  updateClient: (id: string, client: Partial<Client>) => Promise<boolean>;
  deleteClient: (id: string) => Promise<boolean>;
}

const ClientsContext = createContext<ClientsContextType | undefined>(undefined);

export function ClientsProvider({ children }: { children: React.ReactNode }) {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchClients();
    } else {
      setClients([]);
      setLoading(false);
    }
  }, [user]);

  const fetchClients = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error('Error fetching clients:', error);
      setClients([]);
    } finally {
      setLoading(false);
    }
  };

  const createClient = async (clientData: Omit<Client, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Client | null> => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('clients')
        .insert({
          ...clientData,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setClients(prev => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)));
        return data;
      }
    } catch (error) {
      console.error('Error creating client:', error);
    }
    return null;
  };

  const updateClient = async (id: string, clientData: Partial<Client>): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('clients')
        .update({
          ...clientData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      setClients(prev => 
        prev.map(client => 
          client.id === id 
            ? { ...client, ...clientData, updated_at: new Date().toISOString() }
            : client
        ).sort((a, b) => a.name.localeCompare(b.name))
      );
      return true;
    } catch (error) {
      console.error('Error updating client:', error);
      return false;
    }
  };

  const deleteClient = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setClients(prev => prev.filter(client => client.id !== id));
      return true;
    } catch (error) {
      console.error('Error deleting client:', error);
      return false;
    }
  };

  const value = {
    clients,
    loading,
    fetchClients,
    createClient,
    updateClient,
    deleteClient
  };

  return (
    <ClientsContext.Provider value={value}>
      {children}
    </ClientsContext.Provider>
  );
}

export function useClients() {
  const context = useContext(ClientsContext);
  if (context === undefined) {
    throw new Error('useClients must be used within a ClientsProvider');
  }
  return context;
}