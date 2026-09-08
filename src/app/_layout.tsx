import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { useColorScheme } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { useEffect } from 'react'
import { useFonts } from 'expo-font'
import { GolosText_400Regular, GolosText_700Bold, GolosText_800ExtraBold } from '@expo-google-fonts/golos-text'

import { Colors } from '@/constants/theme'
import { AuthProvider } from '@/context/auth'
import { AppProvider } from '@/context/app'

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
	const colorScheme = useColorScheme()
	const isDark = colorScheme === 'dark'
	const bgColor = isDark ? Colors.dark.background : Colors.light.background

	const [fontsLoaded] = useFonts({
		GolosText_400Regular,
		GolosText_700Bold,
		GolosText_800ExtraBold,
	})

	useEffect(() => {
		async function prepare() {
			try {
				if (fontsLoaded) {
					await SplashScreen.hideAsync()
				}
			} catch (e) {
				console.warn(e)
			}
		}
		prepare()
	}, [fontsLoaded])

	return (
		<GestureHandlerRootView style={{ flex: 1, backgroundColor: bgColor }}>
			<AuthProvider>
				<AppProvider>
					<Stack screenOptions={{ headerShown: false }} />
				</AppProvider>
			</AuthProvider>
		</GestureHandlerRootView>
	)
}
