import React, { useState } from 'react'
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	KeyboardAvoidingView,
	Platform,
	useColorScheme,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useAuth } from '@/context/auth'
import { useRouter } from 'expo-router'
import { Colors, Spacing, Typography } from '@/constants/theme'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { ApiError } from '@/lib/api'
import { isValidKgPhone } from '@/lib/auth-api'

type Step = 'phone' | 'code'

export default function LoginScreen() {
	const [step, setStep] = useState<Step>('phone')
	const [phone, setPhone] = useState('+996')
	const [code, setCode] = useState('')
	const [error, setError] = useState('')
	const [busy, setBusy] = useState(false)
	const [debugCode, setDebugCode] = useState<string | null>(null)

	const { requestCode, verifyCode } = useAuth()
	const router = useRouter()
	const colorScheme = useColorScheme() ?? 'dark'
	const isDark = colorScheme === 'dark'
	const colors = isDark ? Colors.dark : Colors.light
	const insets = useSafeAreaInsets()

	const handleRequestCode = async () => {
		setError('')
		if (!isValidKgPhone(phone)) {
			setError('Формат номера: +996XXXXXXXXX')
			return
		}
		setBusy(true)
		try {
			const res = await requestCode(phone)
			setDebugCode(res.debugCode ?? null)
			setStep('code')
		} catch (err) {
			setError(err instanceof ApiError ? err.message : 'Не удалось отправить код')
		} finally {
			setBusy(false)
		}
	}

	const handleVerify = async () => {
		setError('')
		if (code.length !== 4) {
			setError('Введите 4-значный код')
			return
		}
		setBusy(true)
		try {
			const result = await verifyCode(phone, code)
			if (result.isNewUser) {
				router.replace('/auth/register')
			} else {
				router.replace('/')
			}
		} catch (err) {
			setError(err instanceof ApiError ? err.message : 'Неверный код')
		} finally {
			setBusy(false)
		}
	}

	return (
		<KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
			<ScrollView
				style={[styles.container, { backgroundColor: colors.background }]}
				contentContainerStyle={[styles.content, { paddingTop: Spacing.four + insets.top }]}
			>
				<View style={styles.header}>
					<Text style={[styles.title, { color: colors.text }]}>Кудайберген</Text>
					<Text style={[styles.subtitle, { color: colors.textSecondary }]}>
						Автозапчасти и услуги
					</Text>
				</View>

				{error ? (
					<View style={[styles.errorBox, { backgroundColor: colors.error }]}>
						<Text style={styles.errorText}>{error}</Text>
					</View>
				) : null}

				{step === 'phone' ? (
					<View style={styles.form}>
						<Input
							placeholder="+996700123456"
							value={phone}
							onChangeText={setPhone}
							keyboardType="phone-pad"
							autoCapitalize="none"
						/>
						<Button
							title={busy ? 'Отправка...' : 'Получить код'}
							onPress={handleRequestCode}
							size="large"
							disabled={busy}
							style={{ marginTop: Spacing.four }}
						/>
					</View>
				) : (
					<View style={styles.form}>
						<Text style={[styles.subtitle, { color: colors.textSecondary, marginBottom: Spacing.three }]}>
							Код отправлен на {phone}
						</Text>
						<Input
							placeholder="0000"
							value={code}
							onChangeText={setCode}
							keyboardType="number-pad"
							maxLength={4}
						/>
						{debugCode ? (
							<Text style={[styles.footerText, { color: colors.textTertiary, marginTop: Spacing.two }]}>
								Dev-код: {debugCode}
							</Text>
						) : null}
						<Button
							title={busy ? 'Проверка...' : 'Подтвердить'}
							onPress={handleVerify}
							size="large"
							disabled={busy}
							style={{ marginTop: Spacing.four }}
						/>
						<Button
							title="Изменить номер"
							onPress={() => {
								setStep('phone')
								setCode('')
								setError('')
							}}
							variant="secondary"
							size="large"
							style={{ marginTop: Spacing.three }}
						/>
					</View>
				)}
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
	footerText: {
		fontSize: Typography.secondary.fontSize,
	},
})
