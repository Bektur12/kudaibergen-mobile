import { Platform } from 'react-native'
import * as Device from 'expo-device'
import * as Notifications from 'expo-notifications'
import Constants from 'expo-constants'
import { registerDevice, unregisterDevice } from '@/lib/auth-api'

/**
 * Push notifications via Expo's push service (not raw FCM/APNs).
 * One HTTP call (https://exp.host/--/api/v2/push/send) works for both
 * platforms — the backend never talks to Firebase or Apple directly.
 * See BACKEND_SPEC.md → `device_tokens` table + notification_outbox worker.
 *
 * IMPORTANT: remote push does not work in Expo Go (removed for Android in
 * SDK 53, was already unsupported on iOS before that). Testing a real push
 * requires a development build: `eas build --profile development` or
 * `npx expo run:ios` / `run:android`. Local notifications (schedule*Async)
 * still work fine in Expo Go.
 */
// Foreground presentation: show banner + play sound even while the app is open.
Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowBanner: true,
		shouldShowList: true,
		shouldPlaySound: true,
		shouldSetBadge: false,
	}),
})

export type RegisterPushResult =
	| { ok: true; token: string }
	| { ok: false; reason: 'not-a-device' | 'permission-denied' | 'missing-project-id' | 'error'; error?: unknown }

async function ensureAndroidChannel() {
	if (Platform.OS !== 'android') return
	await Notifications.setNotificationChannelAsync('default', {
		name: 'default',
		importance: Notifications.AndroidImportance.HIGH,
		vibrationPattern: [0, 200, 200, 200],
	})
}

/**
 * Requests permission and returns an Expo push token for this device.
 * Call once the user is authenticated (we need a user_id to attach the
 * token to server-side), then POST the token to the backend — see
 * `syncDeviceToken` below for where that call belongs.
 */
export async function registerForPushNotificationsAsync(): Promise<RegisterPushResult> {
	// The web build is a dev preview, not the shipping target (native RN is) —
	// skip it outright rather than exercise expo-notifications' thinner web
	// support (Device.isDevice is also hardcoded `true` on web, so it alone
	// wouldn't catch this).
	if (Platform.OS === 'web') {
		return { ok: false, reason: 'not-a-device' }
	}

	if (!Device.isDevice) {
		// Simulators/emulators don't have push capability.
		return { ok: false, reason: 'not-a-device' }
	}

	await ensureAndroidChannel()

	const existing = await Notifications.getPermissionsAsync()
	let status = existing.status
	if (status !== 'granted') {
		const requested = await Notifications.requestPermissionsAsync()
		status = requested.status
	}
	if (status !== 'granted') {
		return { ok: false, reason: 'permission-denied' }
	}

	const projectId =
		Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId

	if (!projectId) {
		// No EAS project linked yet — run `eas init` first.
		// (app.json currently has no `extra.eas.projectId`.)
		return { ok: false, reason: 'missing-project-id' }
	}

	try {
		const { data: token } = await Notifications.getExpoPushTokenAsync({ projectId })
		return { ok: true, token }
	} catch (error) {
		return { ok: false, reason: 'error', error }
	}
}

/** Sends the device's Expo push token to `POST /api/v1/devices` (device_tokens table). */
export async function syncDeviceToken(token: string): Promise<void> {
	const platform = Platform.OS === 'ios' ? 'IOS' : 'ANDROID'
	try {
		await registerDevice(token, platform)
	} catch (error) {
		if (__DEV__) console.log('[push] failed to register device token', error)
	}
}

/** Call on logout so the backend stops sending pushes to a device nobody's signed into. */
export async function forgetDeviceToken(token: string): Promise<void> {
	try {
		await unregisterDevice(token)
	} catch (error) {
		if (__DEV__) console.log('[push] failed to unregister device token', error)
	}
}

/**
 * Wires up listeners for (a) a push arriving while the app is foregrounded
 * and (b) the user tapping a push/local notification. Returns a cleanup
 * function — call it from a useEffect's return.
 */
export function addNotificationListeners(handlers: {
	onReceive?: (notification: Notifications.Notification) => void
	onResponse?: (response: Notifications.NotificationResponse) => void
}) {
	const receivedSub = Notifications.addNotificationReceivedListener((n) => {
		handlers.onReceive?.(n)
	})
	const responseSub = Notifications.addNotificationResponseReceivedListener((r) => {
		handlers.onResponse?.(r)
	})

	return () => {
		receivedSub.remove()
		responseSub.remove()
	}
}

/** Fires a local notification a few seconds out — handy for testing permissions/UI without a backend. */
export async function scheduleLocalTestNotification(title: string, body: string) {
	await Notifications.scheduleNotificationAsync({
		content: { title, body },
		trigger: { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: 3 },
	})
}
