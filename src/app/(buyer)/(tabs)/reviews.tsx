import React, { useState } from 'react'
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	TouchableOpacity,
} from 'react-native'
import { useColorScheme } from 'react-native'
import { Colors, Spacing, Typography, BorderRadius } from '@/constants/theme'
import { Header } from '@/components/ui/Header'
import { Card } from '@/components/ui/Card'
import { StarRating } from '@/components/ui/StarRating'
import { Badge } from '@/components/ui/Badge'
import { Divider } from '@/components/ui/Divider'
import { Ionicons } from '@expo/vector-icons'

export default function ReviewsScreen() {
	const colorScheme = useColorScheme() ?? 'dark'
	const isDark = colorScheme === 'dark'
	const colors = isDark ? Colors.dark : Colors.light
	const [filter, setFilter] = useState<'all' | 'seller' | 'buyer'>('all')

	const overallRating = 4.8
	const totalReviews = 324

	const ratingBreakdown = [
		{ stars: 5, count: 245, percentage: 75 },
		{ stars: 4, count: 55, percentage: 17 },
		{ stars: 3, count: 15, percentage: 5 },
		{ stars: 2, count: 5, percentage: 2 },
		{ stars: 1, count: 4, percentage: 1 },
	]

	const reviews = [
		{
			id: 1,
			author: 'Тимур К.',
			rating: 5,
			type: 'seller',
			title: 'Отличный качество запчастей',
			text: 'Заказал несколько деталей для своего ВАЗа. Всё приехало целым, оригинальное. Продавец помог с выбором. Спасибо!',
			date: '3 дня назад',
			helpful: 12,
		},
		{
			id: 2,
			author: 'Азиза М.',
			rating: 5,
			type: 'buyer',
			title: 'Быстрая доставка',
			text: 'Как покупатель очень доволена. Продавец быстро ответил, помог с поиском нужной запчасти. Рекомендую!',
			date: '1 неделю назад',
			helpful: 8,
		},
		{
			id: 3,
			author: 'Замир Т.',
			rating: 4,
			type: 'seller',
			title: 'Хорошо, но небольшая задержка',
			text: 'Товар соответствует описанию. Было небольшое ожидание доставки, но в целом доволен.',
			date: '2 недели назад',
			helpful: 5,
		},
	]

	return (
		<View style={[styles.container, { backgroundColor: colors.background }]}>
			<Header title="Отзывы" />

			<ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
				{/* Overall Rating */}
				<View style={[styles.ratingCard, { backgroundColor: colors.surface }]}>
					<View style={styles.ratingMain}>
						<Text style={[styles.overallRating, { color: colors.accent }]}>
							{overallRating}
						</Text>
						<View>
							<StarRating rating={overallRating} readonly />
							<Text style={[styles.totalReviews, { color: colors.textSecondary }]}>
								{totalReviews} отзывов
							</Text>
						</View>
					</View>

					<Divider orientation="vertical" style={{ marginHorizontal: Spacing.three }} />

					<View style={styles.ratingBreakdown}>
						{ratingBreakdown.map((item) => (
							<View key={item.stars} style={styles.ratingBar}>
								<Text style={[styles.starLabel, { color: colors.textSecondary }]}>
									{item.stars}★
								</Text>
								<View
									style={[
										styles.progressBar,
										{ backgroundColor: colors.surfaceAlt },
									]}
								>
									<View
										style={[
											styles.progressFill,
											{
												width: `${item.percentage}%`,
												backgroundColor: colors.accent,
											},
										]}
									/>
								</View>
								<Text style={[styles.percentage, { color: colors.textTertiary }]}>
									{item.percentage}%
								</Text>
							</View>
						))}
					</View>
				</View>

				{/* Filters */}
				<View style={styles.filterContainer}>
					{(['all', 'seller', 'buyer'] as const).map((f) => (
						<TouchableOpacity
							key={f}
							style={[
								styles.filterBtn,
								filter === f && [
									styles.filterBtnActive,
									{ backgroundColor: colors.accent },
								],
								{ borderColor: colors.surfaceAlt },
							]}
							onPress={() => setFilter(f)}
						>
							<Text
								style={[
									styles.filterLabel,
									{
										color: filter === f ? colors.background : colors.text,
									},
								]}
							>
								{f === 'all' ? 'Все' : f === 'seller' ? 'Продавец' : 'Покупатель'}
							</Text>
						</TouchableOpacity>
					))}
				</View>

				{/* Reviews List */}
				{reviews.map((review) => (
					<Card key={review.id} variant="outlined" style={styles.reviewCard}>
						<View style={styles.reviewHeader}>
							<View style={styles.authorInfo}>
								<Text style={[styles.authorName, { color: colors.text }]}>
									{review.author}
								</Text>
								<Badge
									variant={review.type === 'seller' ? 'success' : 'accent'}
									label={review.type === 'seller' ? 'Продавец' : 'Покупатель'}
									size="small"
								/>
							</View>
							<Text style={[styles.reviewDate, { color: colors.textTertiary }]}>
								{review.date}
							</Text>
						</View>

						<View style={styles.ratingRow}>
							<StarRating rating={review.rating} readonly size="small" />
						</View>

						<Text style={[styles.reviewTitle, { color: colors.text }]}>
							{review.title}
						</Text>
						<Text style={[styles.reviewText, { color: colors.textSecondary }]}>
							{review.text}
						</Text>

						<TouchableOpacity style={styles.helpfulBtn}>
							<Ionicons name="thumbs-up-outline" size={16} color={colors.textTertiary} />
							<Text style={[styles.helpfulText, { color: colors.textTertiary }]}>
								Полезно ({review.helpful})
							</Text>
						</TouchableOpacity>
					</Card>
				))}

				<View style={{ height: Spacing.four }} />
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
	ratingCard: {
		borderRadius: 12,
		padding: Spacing.four,
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: Spacing.four,
	},
	ratingMain: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: Spacing.two,
	},
	overallRating: {
		fontSize: 40,
		fontWeight: '700',
	},
	totalReviews: {
		fontSize: 12,
		marginTop: Spacing.one,
	},
	ratingBreakdown: {
		flex: 1,
		gap: Spacing.one,
	},
	ratingBar: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: Spacing.one,
	},
	starLabel: {
		fontSize: 11,
		fontWeight: '600',
		width: 20,
	},
	progressBar: {
		height: 4,
		borderRadius: 2,
		flex: 1,
		overflow: 'hidden',
	},
	progressFill: {
		height: '100%',
	},
	percentage: {
		fontSize: 11,
		width: 30,
		textAlign: 'right',
	},
	filterContainer: {
		flexDirection: 'row',
		gap: Spacing.two,
		marginBottom: Spacing.four,
	},
	filterBtn: {
		paddingHorizontal: Spacing.three,
		paddingVertical: Spacing.two,
		borderRadius: 8,
		borderWidth: 1,
	},
	filterBtnActive: {
		borderWidth: 0,
	},
	filterLabel: {
		fontSize: 13,
		fontWeight: '600',
	},
	reviewCard: {
		padding: Spacing.three,
		marginBottom: Spacing.three,
	},
	reviewHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
		marginBottom: Spacing.two,
	},
	authorInfo: {
		gap: Spacing.one,
	},
	authorName: {
		fontSize: 14,
		fontWeight: '700',
	},
	reviewDate: {
		fontSize: 12,
	},
	ratingRow: {
		marginBottom: Spacing.two,
	},
	reviewTitle: {
		fontSize: 14,
		fontWeight: '600',
		marginBottom: Spacing.one,
	},
	reviewText: {
		fontSize: 13,
		lineHeight: 18,
		marginBottom: Spacing.two,
	},
	helpfulBtn: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: Spacing.one,
		paddingTop: Spacing.two,
	},
	helpfulText: {
		fontSize: 12,
		fontWeight: '600',
	},
})
