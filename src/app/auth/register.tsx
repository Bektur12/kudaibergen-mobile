import React, { useState } from 'react'
import {
	View,
	Text,
	StyleSheet,
	useColorScheme,
	ScrollView,
	SafeAreaView,
	TouchableOpacity,
} from 'react-native'
import { useRouter } from 'expo-router'
import { Colors, Spacing } from '@/constants/theme'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuth } from '@/context/auth'
import { ApiError } from '@/lib/api'
import type { ApiRole } from '@/lib/auth-api'

export default function RegisterScreen() {
	const colorScheme = useColorScheme() ?? 'dark'
	const isDark = colorScheme === 'dark'
	const colors = isDark ? Colors.dark : Colors.light
	const router = useRouter()
	const { finishRegistration } = useAuth()

	const [role, setRole] = useState<ApiRole>('BUYER')
	const [name, setName] = useState('')
	const [city, setCity] = useState('')
	const [storeName, setStoreName] = useState('')
	const [businessType, setBusinessType] = useState('')
	const [error, setError] = useState('')
	const [busy, setBusy] = useState(false)

	const handleRegister = async () => {
		setError('')
		if (role === 'SELLER' && !storeName.trim()) {
			setError('Укажите название магазина')
			return
		}
		setBusy(true)
		try {
			await finishRegistration({
				role,
				name: name.trim() || undefined,
				city: city.trim() || undefined,
				storeName: role === 'SELLER' ? storeName.trim() : undefined,
				businessType: role === 'SELLER' ? businessType.trim() || undefined : undefined,
			})
			router.replace('/')
		} catch (err) {
			setError(err instanceof ApiError ? err.message : 'Не удалось завершить регистрацию')
		} finally {
			setBusy(false)
		}
	}

	return (
		<SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
			<ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
				<View style={styles.header}>
					<Text style={[styles.title, { color: colors.text }]}>Создать аккаунт</Text>
					<Text style={[styles.subtitle, { color: colors.textSecondary }]}>
						Выберите роль и заполните данные
					</Text>
				</View>

				{error ? (
					<View style={[styles.errorBox, { backgroundColor: colors.error }]}>
						<Text style={styles.errorText}>{error}</Text>
					</View>
				) : null}

				<View style={styles.roleSelector}>
					<TouchableOpacity
						onPress={() => setRole('BUYER')}
						style={[
							styles.roleButton,
							{
								backgroundColor: role === 'BUYER' ? colors.accent : colors.surface,
								borderColor: colors.border,
							},
						]}
					>
						<Text
							style={[
								styles.roleButtonText,
								{ color: role === 'BUYER' ? colors.background : colors.text },
							]}
						>
							Покупатель
						</Text>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => setRole('SELLER')}
						style={[
							styles.roleButton,
							{
								backgroundColor: role === 'SELLER' ? colors.accent : colors.surface,
								borderColor: colors.border,
							},
						]}
					>
						<Text
							style={[
								styles.roleButtonText,
								{ color: role === 'SELLER' ? colors.background : colors.text },
							]}
						>
							Продавец
						</Text>
					</TouchableOpacity>
				</View>

				<View style={styles.form}>
					<Input placeholder="Имя" value={name} onChangeText={setName} />
					<Input placeholder="Город" value={city} onChangeText={setCity} />

					{role === 'SELLER' && (
						<>
							<Input placeholder="Название магазина" value={storeName} onChangeText={setStoreName} />
							<Input
								placeholder="Тип бизнеса (магазин, СТО...)"
								value={businessType}
								onChangeText={setBusinessType}
							/>
						</>
					)}

					<Button
						title={busy ? 'Сохранение...' : 'Создать аккаунт'}
						onPress={handleRegister}
						disabled={busy}
					/>
				</View>
			</ScrollView>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	scrollContent: {
		flexGrow: 1,
		padding: Spacing.four,
	},
	header: {
		marginBottom: Spacing.five,
	},
	title: {
		fontSize: 28,
		fontWeight: '800',
		marginBottom: Spacing.one,
	},
	subtitle: {
		fontSize: 16,
		fontWeight: '500',
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
	roleSelector: {
		flexDirection: 'row',
		gap: Spacing.two,
		marginBottom: Spacing.five,
	},
	roleButton: {
		flex: 1,
		paddingVertical: Spacing.three,
		borderRadius: 12,
		borderWidth: 2,
		alignItems: 'center',
	},
	roleButtonText: {
		fontSize: 15,
		fontWeight: '600',
	},
	form: {
		gap: Spacing.two,
	},
})
