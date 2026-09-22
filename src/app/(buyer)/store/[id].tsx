import React, { useEffect, useState } from 'react'
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	TouchableOpacity,
	ActivityIndicator,
	Alert,
	Modal,
	KeyboardAvoidingView,
	Platform,
	useColorScheme,
} from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Colors, Spacing, Typography } from '@/constants/theme'
import { Header } from '@/components/ui/Header'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { StarRating } from '@/components/ui/StarRating'
import { Divider } from '@/components/ui/Divider'
import { Ionicons } from '@expo/vector-icons'
import {
	getStore,
	startStoreChat,
	getStoreReviews,
	createReview,
	toProductCategory,
	type StoreDetails,
	type Review,
} from '@/lib/store-api'
import { getPartCategoryInfo } from '@/data/parts'
import { ApiError } from '@/lib/api'

const BUSINESS_TYPE_LABELS: Record<string, string> = {
	parts: 'Магазин запчастей',
	tires: 'Шиномонтаж',
	oils: 'Масла и жидкости',
	accessories: 'Аксессуары',
	sto: 'СТО',
	carwash: 'Автомойка',
}

export default function StoreDetailScreen() {
	const { id } = useLocalSearchParams<{ id: string }>()
	const router = useRouter()
	const colorScheme = useColorScheme() ?? 'dark'
	const isDark = colorScheme === 'dark'
	const colors = isDark ? Colors.dark : Colors.light

	const [activeTab, setActiveTab] = useState<'info' | 'reviews' | 'categories'>('info')
	const [store, setStore] = useState<StoreDetails | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(false)
	const [messaging, setMessaging] = useState(false)

	const [reviews, setReviews] = useState<Review[]>([])
	const [reviewsLoaded, setReviewsLoaded] = useState(false)
	const [loadingReviews, setLoadingReviews] = useState(false)
	const [reviewModalVisible, setReviewModalVisible] = useState(false)
	const [reviewRating, setReviewRating] = useState(5)
	const [reviewText, setReviewText] = useState('')
	const [submittingReview, setSubmittingReview] = useState(false)

	useEffect(() => {
		let cancelled = false
		async function load() {
			setLoading(true)
			setError(false)
			try {
				const data = await getStore(Number(id))
				if (!cancelled) setStore(data)
			} catch {
				if (!cancelled) setError(true)
			} finally {
				if (!cancelled) setLoading(false)
			}
		}
		load()
		return () => {
			cancelled = true
		}
	}, [id])

	useEffect(() => {
		if (activeTab !== 'reviews' || reviewsLoaded) return
		let cancelled = false
		async function load() {
			setLoadingReviews(true)
			try {
				const res = await getStoreReviews(Number(id))
				if (!cancelled) {
					setReviews(res.content)
					setReviewsLoaded(true)
				}
			} catch {
				// leave the "нет отзывов" state, no need to hard-fail the whole screen
			} finally {
				if (!cancelled) setLoadingReviews(false)
			}
		}
		load()
		return () => {
			cancelled = true
		}
	}, [activeTab, id, reviewsLoaded])

	const handleSubmitReview = async () => {
		setSubmittingReview(true)
		try {
			const review = await createReview(Number(id), { rating: reviewRating, text: reviewText.trim() || undefined })
			setReviews((prev) => [review, ...prev])
			setReviewModalVisible(false)
			setReviewText('')
			setReviewRating(5)
		} catch (err) {
			// Most common case here: no chat with this store yet (CHAT/reviews are
			// gated on that) — the backend's message already explains it in Russian.
			Alert.alert('Не удалось отправить отзыв', err instanceof ApiError ? err.message : 'Попробуйте ещё раз')
		} finally {
			setSubmittingReview(false)
		}
	}

	const handleMessage = async () => {
		if (!store || messaging) return
		setMessaging(true)
		try {
			const chat = await startStoreChat(store.id)
			router.push({
				pathname: '/(buyer)/chat/[id]',
				params: {
					id: chat.id.toString(),
					name: chat.storeName,
					online: String(chat.otherOnline),
					lastSeenAt: chat.otherLastSeenAt ?? '',
				},
			})
		} catch (err) {
			Alert.alert(
				'Не удалось открыть чат',
				err instanceof ApiError ? err.message : 'Попробуйте ещё раз'
			)
		} finally {
			setMessaging(false)
		}
	}

	if (loading) {
		return (
			<View style={[styles.container, styles.centerFill, { backgroundColor: colors.background }]}>
				<ActivityIndicator color={colors.accent} />
			</View>
		)
	}

	if (error || !store) {
		return (
			<View style={[styles.container, { backgroundColor: colors.background }]}>
				<Header title="Профиль магазина" />
				<View style={styles.centerFill}>
					<Text style={{ color: colors.textSecondary, marginBottom: Spacing.three }}>
						Не удалось загрузить магазин
					</Text>
					<Button title="Назад" onPress={() => router.back()} />
				</View>
			</View>
		)
	}

	const partCategories = store.categories
		.map((cat) => getPartCategoryInfo(toProductCategory(cat)))
		.filter((cat): cat is NonNullable<typeof cat> => cat != null)

	return (
		<View style={[styles.container, { backgroundColor: colors.background }]}>
			<Header title="Профиль магазина" />

			<ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
				{/* Store Header */}
				<View style={[styles.storeHeader, { backgroundColor: colors.surface }]}>
					<View style={[styles.logo, { backgroundColor: colors.surfaceAlt, justifyContent: 'center', alignItems: 'center' }]}>
						<Text style={{ fontSize: 30, fontWeight: '700', color: colors.textSecondary }}>
							{store.name.charAt(0)}
						</Text>
					</View>
					<View style={styles.storeInfo}>
						<Text style={[styles.storeName, { color: colors.text }]}>
							{store.name}
						</Text>
						<View style={styles.badges}>
							{store.verificationStatus === 'TRUSTED' && (
								<Badge variant="success" label="Проверен" />
							)}
							{store.verificationStatus === 'VERIFIED' && (
								<Badge variant="accent" label="Проверен" />
							)}
							<Badge variant="accent" label={BUSINESS_TYPE_LABELS[store.businessType] || 'Магазин'} />
						</View>
						<View style={styles.ratingRow}>
							<StarRating rating={store.rating} readonly size="small" />
							<Text style={[styles.ratingText, { color: colors.textSecondary }]}>
								{store.rating} ({store.reviewCount} отзывов)
							</Text>
						</View>
					</View>
				</View>

				{/* Quick Stats */}
				<View style={styles.statsGrid}>
					{[
						{ label: 'Отзывов', value: String(store.reviewCount) },
						{ label: 'Сделок', value: String(store.totalDeals) },
					].map((stat, i) => (
						<View key={i} style={[styles.statItem, { backgroundColor: colors.surface }]}>
							<Text style={[styles.statValue, { color: colors.accent }]}>
								{stat.value}
							</Text>
							<Text style={[styles.statLabel, { color: colors.textSecondary }]}>
								{stat.label}
							</Text>
						</View>
					))}
				</View>

				{/* Tabs */}
				<View style={styles.tabsContainer}>
					{['info', 'reviews', 'categories'].map((tab) => (
						<TouchableOpacity
							key={tab}
							style={[
								styles.tab,
								activeTab === tab && [
									styles.tabActive,
									{ borderBottomColor: colors.accent },
								],
							]}
							onPress={() => setActiveTab(tab as any)}
						>
							<Text
								style={[
									styles.tabLabel,
									{
										color: activeTab === tab ? colors.accent : colors.textSecondary,
									},
								]}
							>
								{tab === 'info'
									? 'Информация'
									: tab === 'reviews'
										? 'Отзывы'
										: 'Запчасти'}
							</Text>
						</TouchableOpacity>
					))}
				</View>

				<Divider />

				{/* Tab Content */}
				{activeTab === 'info' && (
					<View style={styles.tabContent}>
						<Text style={[styles.sectionTitle, { color: colors.text }]}>
							Адреса магазина
						</Text>
						{store.branches.length === 0 ? (
							<Text style={[styles.addressText, { color: colors.textSecondary }]}>
								Филиалы пока не добавлены
							</Text>
						) : (
							store.branches.map((branch) => (
								<Card key={branch.id} variant="outlined" style={styles.addressCard}>
									<View style={styles.addressIcon}>
										<Ionicons name="location" size={20} color={colors.accent} />
									</View>
									<View style={styles.addressInfo}>
										<Text style={[styles.addressTitle, { color: colors.text }]}>
											{branch.city}
										</Text>
										<Text style={[styles.addressText, { color: colors.textSecondary }]}>
											{branch.address}
										</Text>
										{branch.workHours && (
											<Text style={[styles.workingHours, { color: colors.textTertiary }]}>
												{branch.workHours.days.join(', ')}: {branch.workHours.open}-{branch.workHours.close}
											</Text>
										)}
										<Text style={[styles.phone, { color: colors.accent }]}>
											{branch.phone ?? 'Телефон виден после сделки'}
										</Text>
									</View>
								</Card>
							))
						)}
					</View>
				)}

				{activeTab === 'reviews' && (
					<View style={styles.tabContent}>
						<Button
							title="Написать отзыв"
							variant="ghost"
							size="small"
							onPress={() => setReviewModalVisible(true)}
							style={{ marginBottom: Spacing.three, alignSelf: 'flex-start' }}
						/>
						{loadingReviews ? (
							<ActivityIndicator color={colors.accent} />
						) : reviews.length === 0 ? (
							<Text style={[styles.addressText, { color: colors.textSecondary }]}>
								Пока нет отзывов
							</Text>
						) : (
							reviews.map((review) => (
								<Card key={review.id} variant="outlined" style={styles.reviewCard}>
									<View style={styles.reviewHeader}>
										<View>
											<Text style={[styles.reviewAuthor, { color: colors.text }]}>
												{review.authorName}
											</Text>
											<StarRating rating={review.rating} readonly size="small" />
										</View>
										<Text style={[styles.reviewDate, { color: colors.textTertiary }]}>
											{new Date(review.createdAt).toLocaleDateString('ru-RU')}
										</Text>
									</View>
									{!!review.text && (
										<Text style={[styles.reviewText, { color: colors.textSecondary }]}>
											{review.text}
										</Text>
									)}
								</Card>
							))
						)}
					</View>
				)}

				{activeTab === 'categories' && (
					<View style={styles.tabContent}>
						<Text style={[styles.sectionTitle, { color: colors.text }]}>
							Какие запчасти продают
						</Text>
						{partCategories.length === 0 ? (
							<Text style={[styles.addressText, { color: colors.textSecondary }]}>
								Пока нет категорий
							</Text>
						) : (
							partCategories.map((cat) => (
								<Card key={cat!.id} variant="outlined" style={styles.serviceCard}>
									<Text style={[styles.serviceTitle, { color: colors.text }]}>
										{cat!.icon} {cat!.label}
									</Text>
								</Card>
							))
						)}
					</View>
				)}

				<Button
					title={messaging ? 'Открываем чат...' : 'Написать сообщение'}
					onPress={handleMessage}
					disabled={messaging}
					style={styles.messageBtn}
				/>
				<View style={{ height: Spacing.four }} />
			</ScrollView>

			<Modal
				visible={reviewModalVisible}
				transparent
				animationType="slide"
				onRequestClose={() => setReviewModalVisible(false)}
			>
				<KeyboardAvoidingView
					style={{ flex: 1 }}
					behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
				>
					<TouchableOpacity
						style={styles.modalOverlay}
						activeOpacity={1}
						onPress={() => setReviewModalVisible(false)}
					>
						<View style={[styles.modalSheet, { backgroundColor: colors.surface }]}>
							<Text style={[styles.modalTitle, { color: colors.text }]}>Оставить отзыв</Text>
							<StarRating rating={reviewRating} onRatingChange={setReviewRating} readonly={false} size="large" />
							<Input
								placeholder="Комментарий (необязательно)"
								value={reviewText}
								onChangeText={setReviewText}
								multiline
								numberOfLines={3}
							/>
							<View style={styles.modalActions}>
								<Button
									title="Отмена"
									variant="ghost"
									onPress={() => setReviewModalVisible(false)}
									style={styles.modalButton}
								/>
								<Button
									title={submittingReview ? 'Отправка...' : 'Отправить'}
									onPress={handleSubmitReview}
									disabled={submittingReview}
									style={styles.modalButton}
								/>
							</View>
						</View>
					</TouchableOpacity>
				</KeyboardAvoidingView>
			</Modal>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	centerFill: {
		alignItems: 'center',
		justifyContent: 'center',
	},
	content: {
		flex: 1,
	},
	storeHeader: {
		padding: Spacing.four,
		flexDirection: 'row',
		gap: Spacing.three,
	},
	logo: {
		width: 80,
		height: 80,
		borderRadius: 12,
	},
	storeInfo: {
		flex: 1,
	},
	storeName: {
		fontSize: Typography.heading.fontSize,
		fontWeight: '700',
		marginBottom: Spacing.one,
	},
	badges: {
		flexDirection: 'row',
		gap: Spacing.one,
		marginBottom: Spacing.two,
		flexWrap: 'wrap',
	},
	ratingRow: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: Spacing.two,
	},
	ratingText: {
		fontSize: 12,
		fontWeight: '600',
	},
	statsGrid: {
		flexDirection: 'row',
		paddingHorizontal: Spacing.four,
		paddingVertical: Spacing.three,
		gap: Spacing.two,
	},
	statItem: {
		flex: 1,
		paddingVertical: Spacing.three,
		borderRadius: 12,
		alignItems: 'center',
	},
	statValue: {
		fontSize: 18,
		fontWeight: '700',
		marginBottom: Spacing.one,
	},
	statLabel: {
		fontSize: 12,
		fontWeight: '600',
	},
	tabsContainer: {
		flexDirection: 'row',
		borderBottomWidth: 1,
		borderBottomColor: Colors.light.border,
		paddingHorizontal: Spacing.four,
	},
	tab: {
		flex: 1,
		paddingVertical: Spacing.three,
		borderBottomWidth: 2,
		borderBottomColor: 'transparent',
	},
	tabActive: {
		borderBottomWidth: 2,
	},
	tabLabel: {
		fontSize: 14,
		fontWeight: '600',
		textAlign: 'center',
	},
	tabContent: {
		padding: Spacing.four,
	},
	sectionTitle: {
		fontSize: 16,
		fontWeight: '700',
		marginBottom: Spacing.three,
	},
	addressCard: {
		flexDirection: 'row',
		gap: Spacing.three,
		padding: Spacing.three,
		marginBottom: Spacing.three,
	},
	addressIcon: {
		width: 40,
		height: 40,
		borderRadius: 8,
		justifyContent: 'center',
		alignItems: 'center',
	},
	addressInfo: {
		flex: 1,
	},
	addressTitle: {
		fontSize: 14,
		fontWeight: '700',
		marginBottom: Spacing.one,
	},
	addressText: {
		fontSize: 13,
		marginBottom: Spacing.one,
	},
	workingHours: {
		fontSize: 12,
		marginBottom: Spacing.one,
	},
	phone: {
		fontSize: 13,
		fontWeight: '600',
	},
	serviceCard: {
		padding: Spacing.three,
		marginBottom: Spacing.three,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	serviceTitle: {
		fontSize: 14,
		fontWeight: '600',
	},
	messageBtn: {
		marginHorizontal: Spacing.four,
		marginBottom: Spacing.four,
	},
	reviewCard: {
		padding: Spacing.three,
		marginBottom: Spacing.three,
	},
	reviewHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: Spacing.two,
	},
	reviewAuthor: {
		fontSize: 14,
		fontWeight: '600',
		marginBottom: Spacing.one,
	},
	reviewDate: {
		fontSize: 12,
	},
	reviewText: {
		fontSize: 13,
		lineHeight: 18,
	},
	modalOverlay: {
		flex: 1,
		backgroundColor: 'rgba(0,0,0,0.4)',
		justifyContent: 'flex-end',
	},
	modalSheet: {
		borderTopLeftRadius: 16,
		borderTopRightRadius: 16,
		padding: Spacing.five,
		paddingBottom: Spacing.six,
		gap: Spacing.two,
	},
	modalTitle: {
		fontSize: 17,
		fontWeight: '700',
		marginBottom: Spacing.one,
	},
	modalActions: {
		flexDirection: 'row',
		gap: Spacing.two,
		marginTop: Spacing.two,
	},
	modalButton: {
		flex: 1,
	},
})
