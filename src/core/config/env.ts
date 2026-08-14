// Archivo de configuración centralizado para variables de entorno
// Se asegura que la URL y la Key de la BD se consuman exclusivamente desde aquí.

const getEnvVar = (key: string, defaultValue: string = ''): string => {
  return (import.meta.env[key] as string) || defaultValue;
};

export const env = {
  supabaseUrl: getEnvVar('VITE_SUPABASE_URL'),
  supabaseKey: getEnvVar('VITE_SUPABASE_PUBLISHABLE_KEY') || getEnvVar('VITE_SUPABASE_ANON_KEY'),
  adminPassword: getEnvVar('VITE_ADMIN_PASSWORD', 'admin123'),
  isProduction: import.meta.env.PROD,
} as const;

