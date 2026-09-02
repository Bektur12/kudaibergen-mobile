import React, { useState } from 'react'
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	KeyboardAvoidingView,
	Platform,
} from 'react-native'
import { useAuth } from '@/context/auth'
import { useRouter } from 'expo-router'
import { Colors, Spacing, Typography } from '@/constants/theme'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useColorScheme } from 'react-native'

export default function LoginScreen() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState('')
	const { login } = useAuth()
	const router = useRouter()
	const colorScheme = useColorScheme() ?? 'dark'
	const isDark = colorScheme === 'dark'
	const colors = isDark ? Colors.dark : Colors.light

	const handleLogin = async (role: 'buyer' | 'seller') => {
		if (!email || !password) {
			setError('Please fill in all fields')
			return
		}
		try {
			await login(email, password, role)
			router.replace('/')
		} catch (err) {
			setError('Login failed')
		}
	}

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
			style={{ flex: 1 }}
		>
			<ScrollView
				style={[styles.container, { backgroundColor: colors.background }]}
				contentContainerStyle={styles.content}
			>
				<View style={styles.header}>
					<Text style={[styles.title, { color: colors.text }]}>
						Кудайберген
					</Text>
					<Text style={[styles.subtitle, { color: colors.textSecondary }]}>
						Автозапчасти и услуги
					</Text>
				</View>

				{error && (
					<View style={[styles.errorBox, { backgroundColor: colors.error }]}>
						<Text style={styles.errorText}>{error}</Text>
					</View>
				)}

				<View style={styles.form}>
					<Input
						placeholder="Email"
						value={email}
						onChangeText={setEmail}
						keyboardType="email-address"
						autoCapitalize="none"
					/>

					<Input
						placeholder="Password"
						value={password}
						onChangeText={setPassword}
						secureTextEntry
						style={{ marginTop: Spacing.three }}
					/>
				</View>

				<View style={styles.actions}>
					<Button
						title="Вход как Покупатель"
						onPress={() => handleLogin('buyer')}
						size="large"
					/>

					<Button
						title="Вход как Продавец"
						onPress={() => handleLogin('seller')}
						variant="secondary"
						size="large"
						style={{ marginTop: Spacing.three }}
					/>
				</View>

				<View style={styles.footer}>
					<Text style={[styles.footerText, { color: colors.textSecondary }]}>
						Тестовые учетные данные:
					</Text>
					<Text style={[styles.footerText, { color: colors.textTertiary }]}>
						Email: test@example.com
					</Text>
					<Text style={[styles.footerText, { color: colors.textTertiary }]}>
						Password: любой пароль
					</Text>
				</View>
			</ScrollView>
		</KeyboardAvoidingView>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	content: {
		padding: Spacing.four,
		justifyContent: 'space-between',
		minHeight: '100%',
	},
	header: {
		marginTop: Spacing.six,
		marginBottom: Spacing.six,
	},
	title: {
		fontSize: Typography.price.fontSize,
		fontWeight: '800',
		lineHeight: Typography.price.lineHeight,
	},
	subtitle: {
		fontSize: Typography.secondary.fontSize,
		marginTop: Spacing.two,
	},
	form: {
		marginBottom: Spacing.six,
	},
	errorBox: {
		padding: Spacing.three,
		borderRadius: 8,
		marginBottom: Spacing.four,
	},
	errorText: {
		color: '#FFFFFF',
		fontWeight: '600',
		fontSize: 14,
	},
	actions: {
		marginBottom: Spacing.six,
	},
	footer: {
		marginTop: Spacing.six,
	},
	footerText: {
		fontSize: Typography.secondary.fontSize,
		marginVertical: Spacing.one,
	},
})
