import { Redirect } from 'expo-router'
import { useAuth } from '@/context/auth'

export default function RootIndex() {
	const { user } = useAuth()

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
