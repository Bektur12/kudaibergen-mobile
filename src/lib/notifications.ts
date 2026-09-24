import { registerDevice, unregisterDevice } from '@/lib/auth-api'
import Constants, { ExecutionEnvironment } from 'expo-constants'
import * as Device from 'expo-device'
import * as Notifications from 'expo-notifications'
import { Platform } from 'react-native'

/**
 * @react-native-firebase resolves its native TurboModule at *import* time, and
 * Expo Go only ships the native modules Expo bundled into it — so a top-level
 * import throws "Native module NativeRNFBTurboApp is not registered" there.
 * Because this file is reached from the root layout, that one throw took the
 * entire route tree down ("Cannot read property 'ErrorBoundary' of undefined").
 *
 * Loading it lazily keeps Expo Go usable for everything except push, while a
 * development build gets the real thing. Every export below degrades to a
 * no-op when messaging is unavailable rather than throwing.
 */
type MessagingModule = typeof import('@react-native-firebase/messaging')

const isExpoGo =
  Constants.executionEnvironment === ExecutionEnvironment.StoreClient

let messagingModule: MessagingModule | null | undefined

function loadMessaging(): MessagingModule | null {
  if (messagingModule !== undefined) return messagingModule
  if (isExpoGo || Platform.OS === 'web') {
    messagingModule = null
  } else {
    try {
      // Deliberately require(): a static import is hoisted and would run in
      // Expo Go before this guard ever executes, which is the bug being fixed.
      messagingModule =
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        require('@react-native-firebase/messaging') as MessagingModule
    } catch (error) {
      if (__DEV__) console.log('[push] firebase messaging unavailable:', error)
      messagingModule = null
    }
  }
  return messagingModule
}

/**
 * Push notifications via Firebase Cloud Messaging (project kudaibergen-294af).
 * The backend sends through the Firebase Admin SDK, so it needs a raw FCM
 * registration token — not an Expo push token (`ExponentPushToken[...]`,
 * which Firebase rejects). On iOS FCM relays through APNs, which only works
 * once the APNs auth key (.p8) is uploaded in Firebase Console → Cloud Messaging.
 *
 * Split of responsibilities: @react-native-firebase/messaging owns the token
 * (getToken/onTokenRefresh) and remote-message events; expo-notifications
 * owns permissions, the Android channel, foreground presentation and taps.
 *
 * IMPORTANT: neither works in Expo Go — needs a development build
 * (`eas build --profile development` or `npx expo run:ios` / `run:android`).
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
  | {
      ok: false
      reason: 'not-a-device' | 'permission-denied' | 'error' | 'unavailable'
      error?: unknown
    }

async function ensureAndroidChannel() {
  if (Platform.OS !== 'android') return
  await Notifications.setNotificationChannelAsync('default', {
    name: 'default',
    importance: Notifications.AndroidImportance.HIGH,
    vibrationPattern: [0, 200, 200, 200],
  })
}

/**
 * Requests permission and returns this device's FCM registration token.
 * expo-notifications' permission request also covers Android 13+'s
 * POST_NOTIFICATIONS runtime permission (the channel must exist first).
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

  // Expo Go (or any build without the Firebase native module): the rest of the
  // app stays fully usable, push just isn't available here.
  const messaging = loadMessaging()
  if (!messaging) {
    return { ok: false, reason: 'unavailable' }
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

  try {
    // On iOS this also registers with APNs first (auto-register is on by default).
    const token = await messaging.getToken(messaging.getMessaging())
    return { ok: true, token }
  } catch (error) {
    return { ok: false, reason: 'error', error }
  }
}

/**
 * FCM can rotate the token on its own (reinstall/restore, token expiry) —
 * the old one then stops receiving. Re-registers every new one with the
 * backend. Returns an unsubscribe function.
 */
export function watchDeviceTokenRefresh(
  onNewToken: (token: string) => void
): () => void {
  const messaging = loadMessaging()
  if (!messaging) return () => {}
  return messaging.onTokenRefresh(messaging.getMessaging(), async (token) => {
    await syncDeviceToken(token)
    onNewToken(token)
  })
}

/** Sends the device's FCM token to `POST /api/v1/devices` (device_tokens table). */
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
  const responseSub = Notifications.addNotificationResponseReceivedListener(
    (r) => {
      handlers.onResponse?.(r)
    }
  )

  return () => {
    receivedSub.remove()
    responseSub.remove()
  }
}

let initialNotificationHandled = false

/**
 * FCM-side listeners, complementing addNotificationListeners above:
 * - taps on pushes the OS displayed itself (app backgrounded or killed) —
 *   expo's response listener may see the same tap, see the dedupe in app/_layout.tsx;
 * - foreground pushes on Android, which FCM delivers silently — re-posted as a
 *   local notification so the banner still shows (its tap then goes through
 *   expo's response listener). iOS is skipped: the handler at the top of this
 *   file already presents foreground pushes there.
 * Returns a cleanup function.
 */
export function addRemotePushListeners(
  onOpen: (data: Record<string, unknown>) => void
) {
  const fcm = loadMessaging()
  if (!fcm) return () => {}
  const messaging = fcm.getMessaging()

  // The push that cold-started the app is handled once per launch, not on
  // every re-subscribe (e.g. after a logout → login).
  if (!initialNotificationHandled) {
    initialNotificationHandled = true
    fcm.getInitialNotification(messaging).then((message) => {
      if (message?.data) onOpen(message.data)
    })
  }
  const openedUnsub = fcm.onNotificationOpenedApp(messaging, (message) => {
    if (message.data) onOpen(message.data)
  })
  const messageUnsub = fcm.onMessage(messaging, async (message) => {
    if (Platform.OS !== 'android' || !message.notification) return
    await Notifications.scheduleNotificationAsync({
      content: {
        title: message.notification.title ?? '',
        body: message.notification.body ?? '',
        data: message.data ?? {},
      },
      trigger: null,
    })
  })

  return () => {
    openedUnsub()
    messageUnsub()
  }
}

/** Fires a local notification a few seconds out — handy for testing permissions/UI without a backend. */
export async function scheduleLocalTestNotification(
  title: string,
  body: string
) {
  await Notifications.scheduleNotificationAsync({
    content: { title, body },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 3,
    },
  })
}
