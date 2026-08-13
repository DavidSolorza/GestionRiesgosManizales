// Archivo de configuración centralizado para variables de entorno
// Se asegura que la URL y la Key de la BD se consuman exclusivamente desde aquí.

export const env = {
  // En un entorno real se usaría import.meta.env.VITE_SUPABASE_URL
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL || 'http://localhost:54321',
  supabaseKey: import.meta.env.VITE_SUPABASE_ANON_KEY || 'dummy-key',
  
  isProduction: import.meta.env.PROD,
};
