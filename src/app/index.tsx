import { Redirect } from 'expo-router'
import { ActivityIndicator, View } from 'react-native'
import { useAuth } from '@/context/auth'

export default function RootIndex() {
	const { user, loading } = useAuth()

	// Restoring a persisted session (SecureStore + /me) — don't flash the
	// login screen while that's still in flight.
	if (loading) {
		return (
			<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
				<ActivityIndicator />
			</View>
		)
	}

	if (!user) {
		return <Redirect href="/auth/login" />
	}

	if (user.role === 'buyer') {
		return <Redirect href="/(buyer)/(tabs)" />
	}

	if (user.role === 'seller') {
		return <Redirect href="/(seller)/(tabs)" />
	}

	return <Redirect href="/auth/login" />
}
