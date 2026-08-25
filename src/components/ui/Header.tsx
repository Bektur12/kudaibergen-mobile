import React from 'react'
import {
	View,
	Text,
	StyleSheet,
	useColorScheme,
	TouchableOpacity,
	ViewStyle,
} from 'react-native'
import { Colors, Spacing, Typography } from '@/constants/theme'
import { Ionicons } from '@expo/vector-icons'

interface HeaderProps {
	title: string
	onBack?: () => void
	rightAction?: {
		label: string
		onPress: () => void
		icon?: React.ReactNode
	}
	subtitle?: string
	style?: ViewStyle
}

export function Header({
	title,
	onBack,
	rightAction,
	subtitle,
	style,
}: HeaderProps) {
	const colorScheme = useColorScheme() ?? 'dark'
	const isDark = colorScheme === 'dark'
	const colors = isDark ? Colors.dark : Colors.light

	return (
		<View
			style={[
				styles.header,
				{
					backgroundColor: colors.surface,
					borderBottomColor: colors.border,
				},
				style,
			]}
		>
			<View style={styles.content}>
				<View style={styles.left}>
					{onBack && (
						<TouchableOpacity
							onPress={onBack}
							style={styles.backButton}
							hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
						>
							<Ionicons
								name="chevron-back-outline"
								size={28}
								color={colors.text}
							/>
						</TouchableOpacity>
					)}
					<View style={styles.titleContainer}>
						<Text
							style={[
								styles.title,
								{ color: colors.text }
							]}
							numberOfLines={1}
						>
							{title}
						</Text>
						{subtitle && (
							<Text
								style={[
									styles.subtitle,
									{ color: colors.textSecondary }
								]}
								numberOfLines={1}
							>
								{subtitle}
							</Text>
						)}
					</View>
				</View>

				{rightAction && (
					<TouchableOpacity
						onPress={rightAction.onPress}
						style={styles.rightActionButton}
						hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
					>
						{rightAction.icon && rightAction.icon}
						<Text style={[styles.action, { color: colors.accent }]}>
							{rightAction.label}
						</Text>
					</TouchableOpacity>
				)}
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	header: {
		paddingHorizontal: Spacing.four,
		paddingVertical: Spacing.three,
		borderBottomWidth: 1,
	},
	content: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	left: {
		flexDirection: 'row',
		alignItems: 'center',
		flex: 1,
	},
	backButton: {
		marginRight: Spacing.three,
	},
	titleContainer: {
		flex: 1,
	},
	title: {
		fontSize: Typography.heading.fontSize,
		fontWeight: '700',
		lineHeight: Typography.heading.lineHeight,
	},
	subtitle: {
		fontSize: 13,
		marginTop: Spacing.half,
		fontWeight: '500',
	},
	action: {
		fontSize: 15,
		fontWeight: '700',
		marginLeft: Spacing.two,
	},
	rightActionButton: {
		flexDirection: 'row',
		alignItems: 'center',
	},
})
