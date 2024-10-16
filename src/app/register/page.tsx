'use client';
import { useState } from 'react';
import { useSignUp } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

interface ClerkError {
  errors?: Array<{
    message: string;
    code: string;
    longMessage?: string;
  }>;
  message?: string;
}

const RegisterPage = () => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState('');
  const router = useRouter();

  const handleError = (err: ClerkError) => {
    console.error('Error detallado:', JSON.stringify(err, null, 2));
    if (err.errors && err.errors.length > 0) {
      // Usar longMessage si está disponible para más detalles
      setError(err.errors[0].longMessage || err.errors[0].message);
    } else {
      setError(err.message || 'Ha ocurrido un error');
    }
  };

  // Form Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setVerificationStatus('Iniciando proceso de registro...');

    if (!isLoaded) {
      setError('El sistema no está listo. Por favor, espere.');
      setLoading(false);
      return;
    }

    try {
      setVerificationStatus('Creando usuario...');
      const result = await signUp.create({
        firstName,
        lastName,
        emailAddress: email,
        password,
      });

      console.log('Resultado de creación:', result);

      setVerificationStatus('Preparando verificación de email...');
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      
      console.log('Verificación preparada exitosamente');
      setVerificationStatus('Código de verificación enviado. Por favor revisa tu email.');
      setPendingVerification(true);
    } catch (err) {
      console.error('Error en el registro:', err);
      handleError(err as ClerkError);
    } finally {
      setLoading(false);
    }
  };

  // Verify User Email Code
  const onPressVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setVerificationStatus('Iniciando verificación...');

    if (!isLoaded) {
      setError('El sistema no está listo. Por favor, espere.');
      setLoading(false);
      return;
    }

    try {
      setVerificationStatus('Verificando código...');
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });
      
      console.log('Resultado de verificación:', completeSignUp);

      if (completeSignUp.status === 'complete') {
        setVerificationStatus('Verificación exitosa. Iniciando sesión...');
        await setActive({ session: completeSignUp.createdSessionId });
        console.log('Sesión activada, redirigiendo...');
        router.push('/');
      } else {
        console.log('Estado de verificación incompleto:', completeSignUp);
        setError(`La verificación no se pudo completar. Estado: ${completeSignUp.status}`);
      }
    } catch (err) {
      console.error('Error en la verificación:', err);
      handleError(err as ClerkError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Registro</h1>
      
      {error && (
        <div className="mb-4 p-4 text-sm rounded-lg bg-red-100 text-red-700 border border-red-200">
          {error}
        </div>
      )}

      {verificationStatus && (
        <div className="mb-4 p-4 text-sm rounded-lg bg-blue-100 text-blue-700 border border-blue-200">
          {verificationStatus}
        </div>
      )}

      {!pendingVerification ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
              Nombre
            </label>
            <input
              type="text"
              id="first_name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
              Apellido
            </label>
            <input
              type="text"
              id="last_name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="tucorreo@ejemplo.com"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
              disabled={loading}
              minLength={8}
            />
            <p className="mt-1 text-xs text-gray-500">
              La contraseña debe tener al menos 8 caracteres
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Procesando...' : 'Crear cuenta'}
          </button>
        </form>
      ) : (
        <form onSubmit={onPressVerify} className="space-y-4">
          <p className="text-sm text-gray-600 text-center mb-4">
            Te hemos enviado un código de verificación a {email}.<br />
            Por favor, revisa tu bandeja de entrada.
          </p>
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-700">
              Código de verificación
            </label>
            <input
              type="text"
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Ingresa el código de 6 dígitos"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Verificando...' : 'Verificar correo'}
          </button> 
        </form>    
      )}
    </div>
  );
};

export default RegisterPage;