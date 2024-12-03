// lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js'; // Usamos createClient desde el paquete principal

// Reemplaza con tu URL y clave de proyecto de Supabase
const supabaseUrl = process.env.SUPABASE_URL || 'https://glhvayucotwwgdblphud.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY ||'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdsaHZheXVjb3R3d2dkYmxwaHVkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI5MDMwNTksImV4cCI6MjA0ODQ3OTA1OX0.ki7Oc6No7lZ1clKRT3M5gOeL48gj9J2gWnWaL3ddCfQ';

// Crear el cliente de Supabase
export const supabase = createClient(supabaseUrl, supabaseKey);
