import React from 'react'
import {
	View,
	Text,
	StyleSheet,
} from 'react-native'
import { useColorScheme } from 'react-native'
import { Colors, Spacing } from '@/constants/theme'
import { Header } from '@/components/ui/Header'

export default function MapScreen() {
	const colorScheme = useColorScheme() ?? 'dark'
	const isDark = colorScheme === 'dark'
	const colors = isDark ? Colors.dark : Colors.light

	return (
		<View style={[styles.container, { backgroundColor: colors.background }]}>
			<Header title="Рядом со мной" />
			<View style={styles.mapPlaceholder}>
				<Text style={[styles.placeholderText, { color: colors.textSecondary }]}>
					🗺️ Карта интегрируется с Yandex Maps
				</Text>
				<Text style={[styles.placeholderMeta, { color: colors.textTertiary }]}>
					Фаза 1: Placeholder
					{'\n'}
					Фаза 2: Полная карта с магазинами, СТО и авто
				</Text>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	mapPlaceholder: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: Spacing.four,
	},
	placeholderText: {
		fontSize: 18,
		fontWeight: '600',
		marginBottom: Spacing.three,
		textAlign: 'center',
	},
	placeholderMeta: {
		fontSize: 14,
		textAlign: 'center',
		lineHeight: 20,
	},
})
