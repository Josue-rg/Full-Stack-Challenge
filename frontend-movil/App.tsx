import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider } from './src/context/AuthContext';
import ScreenLogin from './src/pages/auth/ScreenLogin';
import ScreenRegister from './src/pages/auth/ScreenRegister';
import ScreenHome from './src/pages/ScreenHome';

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <Stack.Navigator 
          initialRouteName="Login"
          screenOptions={{
            headerShown: false
          }}
        >
          <Stack.Screen name="Login" component={ScreenLogin} />
          <Stack.Screen name="Register" component={ScreenRegister} />
          <Stack.Screen name="Home" component={ScreenHome} />
        </Stack.Navigator>
      </AuthProvider>
    </NavigationContainer>
  );
}

export default App;