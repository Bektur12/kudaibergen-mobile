import React from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { useColorScheme } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Colors, Spacing, Typography } from '@/constants/theme'
import { Header } from '@/components/ui/Header'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

export default function RequestDetailScreen() {
	const { id } = useLocalSearchParams()
	const colorScheme = useColorScheme() ?? 'dark'
	const isDark = colorScheme === 'dark'
	const colors = isDark ? Colors.dark : Colors.light
	const router = useRouter()

	return (
		<View style={[styles.container, { backgroundColor: colors.background }]}>
			<Header
				title="Детали запроса"
				onBack={() => router.back()}
			/>

			<ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
				<Card variant="outlined" style={styles.card}>
					<Text style={[styles.carModel, { color: colors.text }]}>
						BMW X5
					</Text>
					<Text style={[styles.carYear, { color: colors.textSecondary }]}>
						2020 · 3.0L Twin-Turbo
					</Text>

					<View style={styles.divider} />

					<Text style={[styles.label, { color: colors.textSecondary }]}>
						Описание
					</Text>
					<Text style={[styles.description, { color: colors.text }]}>
						Ищу две передние тормозные колодки
					</Text>

					<View style={styles.divider} />

					<Text style={[styles.label, { color: colors.textSecondary }]}>
						Предложения
					</Text>
					<Badge label="3 предложения" variant="accent" size="medium" />
				</Card>
			</ScrollView>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	content: {
		flex: 1,
		padding: Spacing.four,
	},
	card: {
		marginBottom: Spacing.four,
	},
	carModel: {
		fontSize: Typography.heading.fontSize,
		fontWeight: '700',
		marginBottom: Spacing.one,
	},
	carYear: {
		fontSize: 13,
		fontWeight: '500',
	},
	divider: {
		height: 1,
		backgroundColor: 'rgba(0,0,0,0.1)',
		marginVertical: Spacing.three,
	},
	label: {
		fontSize: 12,
		fontWeight: '700',
		textTransform: 'uppercase',
		marginBottom: Spacing.two,
	},
	description: {
		fontSize: 14,
		lineHeight: 20,
		marginBottom: Spacing.three,
	},
})
