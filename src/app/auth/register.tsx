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
import { useAuth } from '@/context/auth'

export default function RegisterScreen() {
	const colorScheme = useColorScheme() ?? 'dark'
	const isDark = colorScheme === 'dark'
	const colors = isDark ? Colors.dark : Colors.light
	const router = useRouter()
	const { login } = useAuth()

	const [role, setRole] = useState<'buyer' | 'seller'>('buyer')

	const handleRegister = async () => {
		await login('user@example.com', 'password', role)
		// Прямой редирект в зависимости от роли
		if (role === 'buyer') {
			router.replace('/')
		} else {
			router.replace('/')
		}
	}

	return (
		<SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
			<ScrollView
				contentContainerStyle={styles.scrollContent}
				showsVerticalScrollIndicator={false}
			>
				<TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
					<Text style={[styles.backText, { color: colors.accent }]}>← Назад</Text>
				</TouchableOpacity>

				<View style={styles.header}>
					<Text style={[styles.title, { color: colors.text }]}>
						Создать аккаунт
					</Text>
					<Text style={[styles.subtitle, { color: colors.textSecondary }]}>
						Выберите роль и заполните данные
					</Text>
				</View>

				<View style={styles.roleSelector}>
					<TouchableOpacity
						onPress={() => setRole('buyer')}
						style={[
							styles.roleButton,
							{
								backgroundColor: role === 'buyer' ? colors.accent : colors.surface,
								borderColor: colors.border,
							},
						]}
					>
						<Text
							style={[
								styles.roleButtonText,
								{
									color: role === 'buyer' ? colors.background : colors.text,
								},
							]}
						>
							Покупатель
						</Text>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => setRole('seller')}
						style={[
							styles.roleButton,
							{
								backgroundColor: role === 'seller' ? colors.accent : colors.surface,
								borderColor: colors.border,
							},
						]}
					>
						<Text
							style={[
								styles.roleButtonText,
								{
									color: role === 'seller' ? colors.background : colors.text,
								},
							]}
						>
							Продавец
						</Text>
					</TouchableOpacity>
				</View>

				<View style={styles.form}>
					<Button
						title="Создать аккаунт"
						onPress={handleRegister}
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
	backButton: {
		marginBottom: Spacing.three,
	},
	backText: {
		fontSize: 15,
		fontWeight: '600',
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
