import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { useColorScheme } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { useEffect } from 'react'
import * as Font from 'expo-font'

import { Colors } from '@/constants/theme'
import { AuthProvider } from '@/context/auth'
import { AppProvider } from '@/context/app'

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
	const colorScheme = useColorScheme()
	const isDark = colorScheme === 'dark'
	const bgColor = isDark ? Colors.dark.background : Colors.light.background

	useEffect(() => {
		async function prepare() {
			try {
				await Font.loadAsync({
					'Inter': require('@/assets/fonts/Inter.ttf'),
				})
			} catch (e) {
				console.warn(e)
			} finally {
				SplashScreen.hideAsync()
			}
		}
		prepare()
	}, [])

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
