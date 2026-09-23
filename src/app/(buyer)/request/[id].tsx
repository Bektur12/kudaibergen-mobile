import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Header } from '@/components/ui/Header'
import { Colors, Spacing, Typography } from '@/constants/theme'
import { getPartCategoryInfo } from '@/data/parts'
import { ApiError } from '@/lib/api'
import {
	cancelRequest,
	extendRequest,
	getRequest,
	type OfferSummary,
	type RequestDetails,
} from '@/lib/request-api'
import { toProductCategory } from '@/lib/store-api'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import {
	ActivityIndicator,
	Alert,
	ScrollView,
	StyleSheet,
	Text,
	useColorScheme,
	View,
} from 'react-native'

const STATUS_LABELS: Record<string, string> = {
	ACTIVE: 'Активен',
	COMPLETED: 'Завершён',
	EXPIRED: 'Истёк',
	CANCELLED: 'Отменён',
}

function formatMoney(amount: number, currency: string) {
	return `${amount.toLocaleString('ru-RU')} ${currency}`
}

export default function RequestDetailScreen() {
	const { id, sellersMatched } = useLocalSearchParams<{ id: string; sellersMatched?: string }>()
	const colorScheme = useColorScheme() ?? 'dark'
	const isDark = colorScheme === 'dark'
	const colors = isDark ? Colors.dark : Colors.light
	const router = useRouter()

	const [request, setRequest] = useState<RequestDetails | null>(null)
	const [loading, setLoading] = useState(true)
	const [busyAction, setBusyAction] = useState(false)

	useEffect(() => {
		let cancelled = false
		async function load() {
			try {
				const data = await getRequest(Number(id))
				if (!cancelled) setRequest(data)
			} catch {
				if (!cancelled) setRequest(null)
			} finally {
				if (!cancelled) setLoading(false)
			}
		}
		load()
		return () => {
			cancelled = true
		}
	}, [id])

	// No "accept" step anymore — the chat already exists the moment the
	// seller replied, so this just opens it.
	const openOfferChat = (offer: OfferSummary) => {
		router.push({
			pathname: '/(buyer)/chat/[id]',
			params: { id: offer.chatId.toString(), name: offer.storeName },
		})
	}

	const handleExtend = async () => {
		setBusyAction(true)
		try {
			setRequest(await extendRequest(Number(id)))
		} catch (err) {
			Alert.alert('Не удалось продлить', err instanceof ApiError ? err.message : 'Попробуйте ещё раз')
		} finally {
			setBusyAction(false)
		}
	}

	const handleCancel = async () => {
		setBusyAction(true)
		try {
			setRequest(await cancelRequest(Number(id)))
		} catch (err) {
			Alert.alert('Не удалось отменить', err instanceof ApiError ? err.message : 'Попробуйте ещё раз')
		} finally {
			setBusyAction(false)
		}
	}

	if (loading) {
		return (
			<View style={[styles.container, styles.centerFill, { backgroundColor: colors.background }]}>
				<ActivityIndicator color={colors.accent} />
			</View>
		)
	}

	if (!request) {
		return (
			<View style={[styles.container, { backgroundColor: colors.background }]}>
				<Header title="Детали запроса" onBack={() => router.back()} />
				<View style={styles.centerFill}>
					<Text style={{ color: colors.textSecondary }}>Запрос не найден</Text>
				</View>
			</View>
		)
	}

	const categoryInfo = getPartCategoryInfo(toProductCategory(request.category))
	const isActive = request.status === 'ACTIVE'

	return (
		<View style={[styles.container, { backgroundColor: colors.background }]}>
			<Header title="Детали запроса" onBack={() => router.back()} />

			<ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
				{sellersMatched != null && (
					<View style={[styles.matchedBanner, { backgroundColor: colors.accent }]}>
						<Text style={styles.matchedBannerText}>
							{Number(sellersMatched) > 0
								? `Запрос увидят ${sellersMatched} продавцов в вашем городе`
								: 'Запрос создан — ждём, когда появятся подходящие продавцы'}
						</Text>
					</View>
				)}

				<Card variant="outlined" style={styles.card}>
					<View style={styles.titleRow}>
						<Text style={[styles.carModel, { color: colors.text }]}>
							{categoryInfo?.label ?? request.category}
						</Text>
						{request.isUrgent && <Badge label="Срочно" variant="error" size="small" />}
					</View>
					{request.car && (
						<Text style={[styles.carYear, { color: colors.textSecondary }]}>{request.car}</Text>
					)}

					<View style={styles.divider} />

					<Text style={[styles.label, { color: colors.textSecondary }]}>Описание</Text>
					<Text style={[styles.description, { color: colors.text }]}>{request.description}</Text>

					{(request.budgetMin || request.budgetMax) && (
						<>
							<View style={styles.divider} />
							<Text style={[styles.label, { color: colors.textSecondary }]}>Бюджет</Text>
							<Text style={[styles.description, { color: colors.text }]}>
								{request.budgetMin && request.budgetMax
									? `${formatMoney(request.budgetMin, request.currency ?? '')} – ${formatMoney(request.budgetMax, request.currency ?? '')}`
									: formatMoney((request.budgetMax ?? request.budgetMin)!, request.currency ?? '')}
							</Text>
						</>
					)}

					<View style={styles.divider} />

					<View style={styles.statusRow}>
						<Badge
							label={STATUS_LABELS[request.status] ?? request.status}
							variant={isActive ? 'success' : 'gray'}
							size="medium"
						/>
						<Badge label={`${request.offers.length} предложений`} variant="accent" size="medium" />
					</View>

					{isActive && (
						<View style={styles.actionsRow}>
							<Button title="Продлить на 24ч" variant="ghost" size="small" onPress={handleExtend} disabled={busyAction} />
							<Button title="Отменить" variant="ghost" size="small" onPress={handleCancel} disabled={busyAction} />
						</View>
					)}
				</Card>

				<Text style={[styles.sectionTitle, { color: colors.text }]}>Предложения</Text>

				{request.offers.length === 0 ? (
					<Text style={{ color: colors.textSecondary }}>Пока никто не ответил</Text>
				) : (
					request.offers.map((offer) => (
						<Card key={offer.id} variant="outlined" style={styles.offerCard}>
							<View style={styles.titleRow}>
								<Text style={[styles.offerStore, { color: colors.text }]}>{offer.storeName}</Text>
								<Text style={[styles.offerRating, { color: colors.textSecondary }]}>
									★ {offer.storeRating.toFixed(1)}
								</Text>
							</View>
							{offer.price != null && (
								<Text style={[styles.offerPrice, { color: colors.accent }]}>
									{formatMoney(offer.price, offer.currency)}
								</Text>
							)}
							{!!offer.comment && (
								<Text style={[styles.description, { color: colors.textSecondary }]}>{offer.comment}</Text>
							)}
							{offer.deliveryDays != null && (
								<Text style={[styles.offerMeta, { color: colors.textTertiary }]}>
									Доставка: {offer.deliveryDays} дн.
								</Text>
							)}
							<View style={styles.offerFooter}>
								<Button
									title="Написать"
									onPress={() => openOfferChat(offer)}
									size="small"
									style={styles.acceptBtn}
								/>
								{offer.status !== 'ACTIVE' && (
									<Badge label={offer.status} variant="gray" size="small" />
								)}
							</View>
						</Card>
					))
				)}

				<View style={{ height: Spacing.six }} />
			</ScrollView>
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
		padding: Spacing.four,
	},
	card: {
		marginBottom: Spacing.four,
	},
	matchedBanner: {
		borderRadius: 12,
		paddingHorizontal: Spacing.four,
		paddingVertical: Spacing.three,
		marginBottom: Spacing.four,
	},
	matchedBannerText: {
		fontSize: 14,
		fontWeight: '700',
		color: '#fff',
	},
	titleRow: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		gap: Spacing.two,
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
	statusRow: {
		flexDirection: 'row',
		gap: Spacing.two,
	},
	actionsRow: {
		flexDirection: 'row',
		gap: Spacing.two,
		marginTop: Spacing.three,
	},
	sectionTitle: {
		fontSize: 16,
		fontWeight: '700',
		marginBottom: Spacing.three,
	},
	offerCard: {
		marginBottom: Spacing.three,
	},
	offerStore: {
		fontSize: 15,
		fontWeight: '700',
	},
	offerRating: {
		fontSize: 13,
	},
	offerPrice: {
		fontSize: 20,
		fontWeight: '800',
		marginTop: Spacing.one,
		marginBottom: Spacing.two,
	},
	offerMeta: {
		fontSize: 12,
		marginBottom: Spacing.two,
	},
	offerFooter: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: Spacing.two,
		marginTop: Spacing.two,
	},
	acceptBtn: {
		marginTop: 0,
	},
})
