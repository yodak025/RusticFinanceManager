import { useState} from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';

const Login= ({isLoggedIn}:{isLoggedIn: (bool:boolean) => void}) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [inputValue, setInputValue] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch('/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: inputValue }),
      });
      
      if (response.ok) {
        isLoggedIn(true);
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleRegister = async () => {
    try {
      const response = await fetch('/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: inputValue }),
      });
      
      if (response.ok) {
        isLoggedIn(true);
      }
    } catch (error) {
      console.error('Register error:', error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <CardTitle className="text-center">
            {isLoginMode ? 'Bienvenido de vuelta' : 'Crear Cuenta'}
          </CardTitle>
          <CardDescription className="text-center">
            {isLoginMode 
              ? 'Ingresa tu nombre de usuario para iniciar sesión' 
              : 'Ingresa un nombre de usuario para crear tu cuenta'
            }
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium">
              Nombre de usuario
            </label>
            <input
              id="username"
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ingresa tu nombre de usuario"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
            />
          </div>
          
          <Button 
            onClick={isLoginMode ? handleLogin : handleRegister}
            className="w-full"
          >
            {isLoginMode ? 'Iniciar Sesión' : 'Crear Cuenta'}
          </Button>
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-muted-foreground">
            {isLoginMode ? "¿No tienes una cuenta?" : "¿Ya tienes una cuenta?"}
          </div>
          <Button 
            variant="ghost" 
            onClick={() => setIsLoginMode(!isLoginMode)}
            className="w-full"
          >
            {isLoginMode ? 'Crear nueva cuenta' : 'Iniciar sesión'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;