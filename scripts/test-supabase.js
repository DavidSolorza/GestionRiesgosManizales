import fs from 'fs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar .env desde la raíz
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Faltan variables de entorno de Supabase en .env');
  process.exit(1);
}

const headers = {
  'Content-Type': 'application/json',
  'apikey': SUPABASE_KEY,
  'Authorization': `Bearer ${SUPABASE_KEY}`,
  'Prefer': 'return=representation'
};

async function testSupabase() {
  console.log('--- INICIANDO PRUEBAS DE SUPABASE ---');
  console.log(`URL: ${SUPABASE_URL}`);
  
  try {
    // 1. Crear un reporte dummy
    console.log('\n1. Probando creación de Reporte (POST /rest/v1/reports)');
    const postRes = await fetch(`${SUPABASE_URL}/rest/v1/reports`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        title: 'Prueba de Sistema Automática',
        description: 'Este es un registro de prueba de conexión.',
        latitude: 5.06889,
        longitude: -75.51738,
        reporter_name: 'Test System',
        reporter_phone: '0000000',
        needs: 'Otro',
        status: 'requiere_ayuda'
      })
    });

    if (!postRes.ok) {
      const errorText = await postRes.text();
      throw new Error(`Error en POST: ${postRes.status} ${postRes.statusText}\n${errorText}`);
    }
    
    const postData = await postRes.json();
    console.log('✅ POST Exitoso. Registro creado:');
    console.log(postData);
    
    const testId = postData[0]?.id;

    // 2. Leer los reportes
    console.log('\n2. Probando lectura de Reportes (GET /rest/v1/reports)');
    const getRes = await fetch(`${SUPABASE_URL}/rest/v1/reports?order=created_at.desc&limit=5`, {
      method: 'GET',
      headers
    });

    if (!getRes.ok) {
      throw new Error(`Error en GET: ${getRes.status} ${getRes.statusText}`);
    }

    const getData = await getRes.json();
    console.log(`✅ GET Exitoso. Se obtuvieron ${getData.length} registros recientes.`);

    // 3. Eliminar el reporte de prueba (Opcional, para limpiar)
    if (testId) {
      console.log(`\n3. Limpiando reporte de prueba (DELETE /rest/v1/reports?id=eq.${testId})`);
      const delRes = await fetch(`${SUPABASE_URL}/rest/v1/reports?id=eq.${testId}`, {
        method: 'DELETE',
        headers
      });
      if (!delRes.ok) {
         console.warn(`⚠️ No se pudo eliminar el registro de prueba: ${delRes.statusText}`);
      } else {
         console.log('✅ Limpieza exitosa.');
      }
    }

    console.log('\n--- PRUEBAS COMPLETADAS EXITOSAMENTE ---');
  } catch (error) {
    console.error('\n❌ ERROR EN LAS PRUEBAS:');
    console.error(error.message);
    process.exit(1);
  }
}

//testSupabase();
