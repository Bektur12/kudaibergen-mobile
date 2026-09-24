import { router, Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import * as Notifications from 'expo-notifications'
import { Platform, useColorScheme } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { useEffect } from 'react'
import { useFonts } from 'expo-font'
import { GolosText_400Regular, GolosText_700Bold, GolosText_800ExtraBold } from '@expo-google-fonts/golos-text'

import { Colors } from '@/constants/theme'
import { AuthProvider, useAuth } from '@/context/auth'
import { AppProvider } from '@/context/app'
import { addNotificationListeners, addRemotePushListeners } from '@/lib/notifications'

// Where a tapped notification should land. `data` is the backend's FCM data
// payload (OutboxService): `{ type: 'NEW_MESSAGE', chatId }` or
// `{ type: 'NEW_REQUEST', requestId, category, urgent }` — or, when several
// new requests got batched into one push, `{ type: 'NEW_REQUEST', count }`
// with no requestId. Offers arrive as chat messages (NEW_MESSAGE).
// `(buyer)` and `(seller)` each have their own `chat/[id]` and `request/[id]`
// routes, so which group to push into depends on who's signed in.
let lastTap: { key: string; at: number } | null = null

function handleNotificationTap(data: Record<string, unknown>, role: 'buyer' | 'seller' | undefined) {
	if (!role) return

	// The same tap can be reported by both expo-notifications and
	// @react-native-firebase/messaging — don't push the screen twice.
	const key = JSON.stringify(data)
	if (lastTap && lastTap.key === key && Date.now() - lastTap.at < 3000) return
	lastTap = { key, at: Date.now() }

	const type = data.type as string | undefined
	if (type === 'NEW_MESSAGE' && data.chatId) {
		router.push(`/(${role})/chat/${data.chatId}` as never)
	} else if (type === 'NEW_REQUEST' && role === 'seller') {
		router.push((data.requestId ? `/(seller)/request/${data.requestId}` : '/(seller)/(tabs)') as never)
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

	// FCM-side taps (background/killed) + Android foreground banners. Waits for
	// the session to restore so a cold-start tap knows which role's routes to use.
	useEffect(() => {
		if (loading) return
		return addRemotePushListeners((data) => handleNotificationTap(data, user?.role))
	}, [loading, user?.role])

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
					{/* expo-notifications has no web implementation for
					useLastNotificationResponse (or push in general, see
					notifications.ts) — skip the whole component on web rather
					than let it throw and take the entire app tree down with it. */}
					{Platform.OS !== 'web' && <NotificationRouting />}
					<AppProvider>
						<Stack screenOptions={{ headerShown: false }} />
					</AppProvider>
				</AuthProvider>
			</SafeAreaProvider>
		</GestureHandlerRootView>
	)
}
