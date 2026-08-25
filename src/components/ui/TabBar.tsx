import React from 'react'
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	useColorScheme,
	ViewStyle,
} from 'react-native'
import { Colors, Spacing, Typography } from '@/constants/theme'

interface Tab {
	id: string
	label: string
}

interface TabBarProps {
	tabs: Tab[]
	activeTabId: string
	onTabChange: (tabId: string) => void
	style?: ViewStyle
}

export function TabBar({
	tabs,
	activeTabId,
	onTabChange,
	style,
}: TabBarProps) {
	const colorScheme = useColorScheme() ?? 'dark'
	const isDark = colorScheme === 'dark'
	const colors = isDark ? Colors.dark : Colors.light

	return (
		<View style={[styles.container, { backgroundColor: colors.surface }, style]}>
			{tabs.map((tab) => (
				<TouchableOpacity
					key={tab.id}
					style={[
						styles.tab,
						activeTabId === tab.id && [
							styles.activeTab,
							{ borderBottomColor: colors.accent },
						],
					]}
					onPress={() => onTabChange(tab.id)}
					activeOpacity={0.7}
				>
					<Text
						style={[
							styles.label,
							{
								color:
									activeTabId === tab.id ? colors.accent : colors.textSecondary,
								fontWeight: activeTabId === tab.id ? '700' : '500',
							},
						]}
					>
						{tab.label}
					</Text>
				</TouchableOpacity>
			))}
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		borderBottomWidth: 1,
		borderBottomColor: '#E0E0E0',
	},
	tab: {
		flex: 1,
		paddingHorizontal: Spacing.three,
		paddingVertical: Spacing.three,
		borderBottomWidth: 3,
		borderBottomColor: 'transparent',
		justifyContent: 'center',
		alignItems: 'center',
	},
	activeTab: {
		borderBottomWidth: 3,
	},
	label: {
		fontSize: Typography.secondary.fontSize,
		lineHeight: 20,
	},
})
