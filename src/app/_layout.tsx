import { router, Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import * as Notifications from 'expo-notifications'
import { useColorScheme } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { useEffect } from 'react'
import { useFonts } from 'expo-font'
import { GolosText_400Regular, GolosText_700Bold, GolosText_800ExtraBold } from '@expo-google-fonts/golos-text'

import { Colors } from '@/constants/theme'
import { AuthProvider, useAuth } from '@/context/auth'
import { AppProvider } from '@/context/app'
import { addNotificationListeners } from '@/lib/notifications'

// Where a tapped notification should land, keyed by Notification['type']
// (see src/types/index.ts). `data.chatId` / `data.requestId` come from
// whatever payload the backend puts on the push — see BACKEND_SPEC.md.
// `(buyer)` and `(seller)` each have their own `chat/[id]` and `request/[id]`
// routes, so which group to push into depends on who's signed in.
function handleNotificationTap(data: Record<string, unknown>, role: 'buyer' | 'seller' | undefined) {
	if (!role) return
	const type = data.type as string | undefined
	if (type === 'new_message' && data.chatId) {
		router.push(`/(${role})/chat/${data.chatId}` as never)
	} else if (type === 'new_offer' && data.requestId) {
		router.push(`/(${role})/request/${data.requestId}` as never)
	}
}

SplashScreen.preventAutoHideAsync()

function NotificationRouting() {
	const { user, loading } = useAuth()

	useEffect(() => {
		const cleanup = addNotificationListeners({
			onResponse: (response) => {
				handleNotificationTap(response.notification.request.content.data ?? {}, user?.role)
			},
		})
		return cleanup
	}, [user?.role])

	// Cold start: the app was killed and got launched by tapping a push —
	// addNotificationResponseReceivedListener above only fires for taps while
	// already running, this hook is the documented way to catch the other case.
	const lastResponse = Notifications.useLastNotificationResponse()
	useEffect(() => {
		if (!lastResponse || loading) return
		handleNotificationTap(lastResponse.notification.request.content.data ?? {}, user?.role)
		Notifications.clearLastNotificationResponse()
	}, [lastResponse, loading, user?.role])

	return null
}

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
			<SafeAreaProvider>
				<AuthProvider>
					<NotificationRouting />
					<AppProvider>
						<Stack screenOptions={{ headerShown: false }} />
					</AppProvider>
				</AuthProvider>
			</SafeAreaProvider>
		</GestureHandlerRootView>
	)
}
