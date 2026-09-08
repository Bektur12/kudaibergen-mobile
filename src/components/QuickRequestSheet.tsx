import React, { useState, useCallback, useMemo, forwardRef } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  StyleSheet,
  Switch,
  useColorScheme,
} from 'react-native';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { MessageSquare, CheckCircle2, X } from 'lucide-react-native';
import { C, CDark, T } from './ui';

interface QuickRequestData {
  category: 'auto' | 'parts' | 'service';
  description: string;
  budget?: { min: number; max: number } | null;
  city: string;
  isUrgent: boolean;
}

interface QuickRequestSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: QuickRequestData) => Promise<{ sellersMatched: number }>;
  defaultCategory?: 'auto' | 'parts' | 'service';
  userCity?: string;
}

const CATEGORIES = [
  { id: 'parts' as const, label: 'Запчасти', icon: '🔧' },
  { id: 'auto' as const, label: 'Авто', icon: '🚗' },
  { id: 'service' as const, label: 'Услуги', icon: '🏥' },
];

const BUDGET_PRESETS = [
  { id: 'any', label: 'Неважно', value: null },
  { id: 'under100', label: 'до $100', value: { min: 0, max: 100 } },
  { id: 'under500', label: 'до $500', value: { min: 0, max: 500 } },
  { id: 'under1000', label: 'до $1000', value: { min: 0, max: 1000 } },
];

type SheetState = 'form' | 'success' | 'loading';

const QuickRequestSheet = forwardRef<
  any,
  QuickRequestSheetProps
>(
  (
    {
      isOpen,
      onClose,
      onSubmit,
      defaultCategory = 'parts',
      userCity = 'Бишкек',
    },
    ref
  ) => {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const colors = isDark ? CDark : C;

    const [state, setState] = useState<SheetState>('form');
    const [category, setCategory] = useState<'auto' | 'parts' | 'service'>(
      defaultCategory
    );
    const [description, setDescription] = useState('');
    const [selectedBudget, setSelectedBudget] = useState<string>('any');
    const [isUrgent, setIsUrgent] = useState(false);
    const [sellersCount, setSellersCount] = useState(0);

    const snapPoints = useMemo(() => ['85%'], []);

    const isDescriptionValid = description.trim().length >= 4;

    const handleSubmit = useCallback(async () => {
      if (!isDescriptionValid) return;

      setState('loading');

      try {
        const budget = BUDGET_PRESETS.find(p => p.id === selectedBudget)?.value || null;

        const result = await onSubmit({
          category,
          description: description.trim(),
          budget,
          city: userCity,
          isUrgent,
        });

        setSellersCount(result.sellersMatched);
        setState('success');
      } catch (error) {
        console.error('Error submitting request:', error);
        alert('Ошибка при отправке запроса. Попробуйте ещё раз.');
        setState('form');
      }
    }, [
      category,
      description,
      selectedBudget,
      isUrgent,
      isDescriptionValid,
      onSubmit,
      userCity,
    ]);

    const handleClose = useCallback(() => {
      // Reset state
      setState('form');
      setDescription('');
      setSelectedBudget('any');
      setIsUrgent(false);
      setCategory(defaultCategory);
      setSellersCount(0);
      onClose();
    }, [onClose, defaultCategory]);

    return (
      <BottomSheet
        snapPoints={snapPoints}
        isOpen={isOpen}
        onClose={handleClose}
        enablePanDownToClose
        enableOverDrag={false}
        backgroundStyle={{ backgroundColor: colors.surface }}
        handleIndicatorStyle={{ backgroundColor: colors.border }}
      >
        <BottomSheetScrollView
          style={[styles.container, { backgroundColor: colors.surface }]}
          scrollEnabled={state === 'form'}
          showsVerticalScrollIndicator={false}
        >
          {/* Close Button */}
          <Pressable
            onPress={handleClose}
            style={styles.closeButton}
            hitSlop={8}
          >
            <X size={24} color={colors.textPrimary} />
          </Pressable>

          {state === 'form' && (
            <FormState
              colors={colors}
              category={category}
              setCategory={setCategory}
              description={description}
              setDescription={setDescription}
              selectedBudget={selectedBudget}
              setSelectedBudget={setSelectedBudget}
              isUrgent={isUrgent}
              setIsUrgent={setIsUrgent}
              isDescriptionValid={isDescriptionValid}
              onSubmit={handleSubmit}
            />
          )}

          {state === 'success' && (
            <SuccessState
              colors={colors}
              sellersCount={sellersCount}
              onClose={handleClose}
            />
          )}

          {state === 'loading' && (
            <LoadingState colors={colors} />
          )}
        </BottomSheetScrollView>
      </BottomSheet>
    );
  }
);

QuickRequestSheet.displayName = 'QuickRequestSheet';

// ─────────────────────────────────────────────────────────────────────────
// FORM STATE
// ─────────────────────────────────────────────────────────────────────────

interface FormStateProps {
  colors: any;
  category: 'auto' | 'parts' | 'service';
  setCategory: (cat: 'auto' | 'parts' | 'service') => void;
  description: string;
  setDescription: (desc: string) => void;
  selectedBudget: string;
  setSelectedBudget: (id: string) => void;
  isUrgent: boolean;
  setIsUrgent: (urgent: boolean) => void;
  isDescriptionValid: boolean;
  onSubmit: () => void;
}

function FormState({
  colors,
  category,
  setCategory,
  description,
  setDescription,
  selectedBudget,
  setSelectedBudget,
  isUrgent,
  setIsUrgent,
  isDescriptionValid,
  onSubmit,
}: FormStateProps) {
  return (
    <View style={styles.formContent}>
      {/* Header */}
      <View style={styles.header}>
        <View
          style={[
            styles.headerIcon,
            { backgroundColor: colors.primary + '20' },
          ]}
        >
          <MessageSquare size={24} color={colors.primary} strokeWidth={2} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[T.heading, { color: colors.textPrimary }]}>
            Спросить у продавцов
          </Text>
          <Text
            style={[
              T.secondary,
              {
                color: colors.textSecondary,
                marginTop: 4,
                lineHeight: 18,
              },
            ]}
          >
            Опишите, что вам нужно — запрос увидят подходящие продавцы рядом
            с вами, и вы получите предложения в чат
          </Text>
        </View>
      </View>

      {/* Category Field */}
      <View style={styles.field}>
        <Text style={[T.label, { color: colors.textTertiary, marginBottom: 8 }]}>
          КАТЕГОРИЯ
        </Text>
        <View style={styles.chipRow}>
          {CATEGORIES.map(cat => (
            <Pressable
              key={cat.id}
              onPress={() => setCategory(cat.id)}
              style={[
                styles.chip,
                {
                  borderColor: colors.border,
                  backgroundColor:
                    category === cat.id ? colors.primary : colors.bg,
                },
              ]}
            >
              <Text
                style={[
                  T.body,
                  {
                    color: category === cat.id ? colors.surface : colors.textPrimary,
                  },
                ]}
              >
                {cat.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Description Field */}
      <View style={styles.field}>
        <Text style={[T.label, { color: colors.textTertiary, marginBottom: 8 }]}>
          ЧТО ВЫ ИЩЕТЕ? *
        </Text>
        <TextInput
          style={[
            styles.textarea,
            {
              borderColor: colors.border,
              backgroundColor: colors.bg,
              color: colors.textPrimary,
            },
          ]}
          placeholder="Например: тормозные колодки на Toyota Camry 2020, оригинал или аналог"
          placeholderTextColor={colors.textTertiary}
          multiline
          maxLength={500}
          value={description}
          onChangeText={setDescription}
        />
        <View style={styles.charCounter}>
          <Text style={[T.hint, { color: colors.textTertiary }]}>
            {description.length}/500
          </Text>
          {!isDescriptionValid && description.length > 0 && (
            <Text style={[T.hint, { color: colors.error }]}>
              Минимум 4 символа
            </Text>
          )}
        </View>
      </View>

      {/* Budget Field */}
      <View style={styles.field}>
        <Text style={[T.label, { color: colors.textTertiary, marginBottom: 8 }]}>
          БЮДЖЕТ (опционально)
        </Text>
        <View style={styles.budgetGrid}>
          {BUDGET_PRESETS.map(preset => (
            <Pressable
              key={preset.id}
              onPress={() => setSelectedBudget(preset.id)}
              style={[
                styles.budgetChip,
                {
                  borderColor: colors.border,
                  backgroundColor:
                    selectedBudget === preset.id ? colors.success : colors.bg,
                },
              ]}
            >
              <Text
                style={[
                  T.secondary,
                  {
                    color:
                      selectedBudget === preset.id
                        ? colors.surface
                        : colors.textPrimary,
                  },
                ]}
              >
                {preset.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Urgent Toggle */}
      <View
        style={[
          styles.urgentRow,
          {
            backgroundColor: colors.bg,
            borderColor: colors.border,
          },
        ]}
      >
        <View style={{ flex: 1 }}>
          <Text style={[T.body, { color: colors.textPrimary }]}>
            ⚡ Нужно срочно
          </Text>
          <Text
            style={[
              T.hint,
              { color: colors.textSecondary, marginTop: 2 },
            ]}
          >
            Поднимем запрос выше в ленте продавцов
          </Text>
        </View>
        <Switch
          value={isUrgent}
          onValueChange={setIsUrgent}
          trackColor={{ false: colors.border, true: colors.primary + '80' }}
          thumbColor={isUrgent ? colors.primary : colors.textTertiary}
        />
      </View>

      {/* Submit Button */}
      <Pressable
        onPress={onSubmit}
        disabled={!isDescriptionValid}
        style={[
          styles.submitButton,
          {
            backgroundColor: isDescriptionValid ? colors.primary : colors.border,
          },
        ]}
      >
        <Text
          style={[
            T.button,
            {
              color: isDescriptionValid ? colors.surface : colors.textTertiary,
            },
          ]}
        >
          Отправить продавцам
        </Text>
      </Pressable>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// SUCCESS STATE
// ─────────────────────────────────────────────────────────────────────────

interface SuccessStateProps {
  colors: any;
  sellersCount: number;
  onClose: () => void;
}

function SuccessState({
  colors,
  sellersCount,
  onClose,
}: SuccessStateProps) {
  return (
    <View style={styles.successContent}>
      {/* Success Icon with Pulse */}
      <View style={styles.successIconContainer}>
        <View
          style={[
            styles.successIconBg,
            { backgroundColor: colors.success + '20' },
          ]}
        >
          <CheckCircle2 size={48} color={colors.success} strokeWidth={1.5} />
        </View>
      </View>

      {/* Message */}
      <Text
        style={[
          T.heading,
          {
            color: colors.textPrimary,
            marginVertical: 16,
            textAlign: 'center',
          },
        ]}
      >
        Запрос отправлен
      </Text>

      <Text
        style={[
          T.body,
          {
            color: colors.textSecondary,
            textAlign: 'center',
            lineHeight: 22,
            marginBottom: 24,
          },
        ]}
      >
        <Text style={{ color: colors.primary, fontWeight: '700' }}>
          ≈{sellersCount} продавцов
        </Text>
        {' видели ваш запрос\n\n'}
        Как только кто-то ответит с предложением — пришлём уведомление и
        откроем чат
      </Text>

      {/* Seller Avatars (Decorative) */}
      <View style={styles.avatarRow}>
        {Array.from({ length: Math.min(5, sellersCount) }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.avatarPlaceholder,
              {
                backgroundColor: colors.border,
                marginLeft: i > 0 ? -8 : 0,
                zIndex: 5 - i,
              },
            ]}
          />
        ))}
        {sellersCount > 5 && (
          <View
            style={[
              styles.avatarPlaceholder,
              {
                backgroundColor: colors.primary,
                marginLeft: -8,
              },
            ]}
          >
            <Text
              style={[
                T.label,
                { color: colors.surface, fontSize: 10 },
              ]}
            >
              +{sellersCount - 5}
            </Text>
          </View>
        )}
      </View>

      {/* Close Button */}
      <Pressable
        onPress={onClose}
        style={[
          styles.closeSuccessButton,
          { backgroundColor: colors.primary },
        ]}
      >
        <Text style={[T.button, { color: colors.surface }]}>
          Готово
        </Text>
      </Pressable>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// LOADING STATE
// ─────────────────────────────────────────────────────────────────────────

interface LoadingStateProps {
  colors: any;
}

function LoadingState({ colors }: LoadingStateProps) {
  return (
    <View style={styles.loadingContent}>
      <View
        style={[
          styles.loadingSpinner,
          { borderTopColor: colors.primary },
        ]}
      />
      <Text
        style={[
          T.body,
          {
            color: colors.textSecondary,
            marginTop: 16,
          },
        ]}
      >
        Отправляю запрос...
      </Text>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 8,
    marginBottom: 8,
  },

  // Form State
  formContent: {
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  field: {
    marginBottom: 20,
  },
  chipRow: {
    flexDirection: 'row',
    gap: 8,
  },
  chip: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textarea: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  charCounter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  budgetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  budgetChip: {
    flex: 1,
    minWidth: '48%',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  urgentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 20,
  },
  submitButton: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },

  // Success State
  successContent: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  successIconContainer: {
    marginBottom: 20,
  },
  successIconBg: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 24,
    height: 36,
  },
  avatarPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeSuccessButton: {
    width: '100%',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
  },

  // Loading State
  loadingContent: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  loadingSpinner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderTopColor: '#FF6B35',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
  },
});

export default QuickRequestSheet;
