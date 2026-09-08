import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { C, T, BackBtn, Avatar } from '@/components/ui';

const INITIAL_MESSAGES = [
  {
    id: 1,
    from: 'seller',
    text: 'Здравствуйте! Товар в наличии, тормозные диски Brembo. Цена — 4 500 сом.',
    time: '9:30',
  },
  {
    id: 2,
    from: 'buyer',
    text: 'Добрый день! Подходит для Toyota Camry 70 2020 года?',
    time: '9:38',
  },
  {
    id: 3,
    from: 'seller',
    text: 'Да, подходит. Могу показать живьём, если хотите.',
    time: '9:40',
  },
  {
    id: 4,
    from: 'buyer',
    text: 'Есть другие варианты? Мне нужны передние и задние.',
    time: '9:45',
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.bg,
  },
  header: {
    backgroundColor: C.surface,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontWeight: '700',
    fontSize: 15,
    color: C.textPrimary,
  },
  headerSubtitle: {
    fontSize: 12,
    color: C.success,
    marginTop: 2,
  },
  productPreview: {
    backgroundColor: C.surface,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  productImage: {
    width: 48,
    height: 48,
    backgroundColor: C.bg,
    borderRadius: 8,
  },
  productInfo: {
    flex: 1,
  },
  productTitle: {
    fontWeight: '600',
    fontSize: 13,
    color: C.textPrimary,
  },
  productPrice: {
    fontWeight: '700',
    fontSize: 15,
    color: C.primary,
    marginTop: 2,
  },
  warningBox: {
    backgroundColor: '#FFF3CD',
    borderLeftWidth: 4,
    borderLeftColor: C.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 4,
  },
  warningText: {
    fontSize: 12,
    color: '#856404',
    lineHeight: 18,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: C.surface,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  actionButton: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: C.primary,
  },
  actionButtonPrimary: {
    backgroundColor: C.primary,
    borderColor: C.primary,
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: C.primary,
  },
  actionButtonTextPrimary: {
    color: '#FFFFFF',
  },
  messagesContainer: {
    flex: 1,
  },
  messageBubble: {
    marginVertical: 6,
    paddingHorizontal: 12,
  },
  sellerMessage: {
    alignItems: 'flex-start',
  },
  buyerMessage: {
    alignItems: 'flex-end',
  },
  messageBubbleContent: {
    maxWidth: '80%',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  sellerBubble: {
    backgroundColor: C.surface,
  },
  buyerBubble: {
    backgroundColor: C.primary,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 21,
  },
  messageTime: {
    fontSize: 11,
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: C.surface,
    borderTopWidth: 1,
    borderTopColor: C.border,
    alignItems: 'flex-end',
  },
  inputField: {
    flex: 1,
    backgroundColor: C.bg,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: C.textPrimary,
  },
  sendButton: {
    backgroundColor: C.primary,
    borderRadius: 8,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default function ChatDetailScreen({ onBack }: { onBack?: () => void }) {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState('');

  const send = () => {
    if (!input.trim()) return;
    const newMessage = {
      id: messages.length + 1,
      from: 'buyer',
      text: input.trim(),
      time: new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }),
    };
    setMessages([...messages, newMessage]);
    setInput('');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <BackBtn onBack={onBack} />
        <View style={{ position: 'relative' }}>
          <Avatar initials="АД" size={38} color={C.primary} />
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              width: 10,
              height: 10,
              borderRadius: 5,
              backgroundColor: C.success,
              borderWidth: 2,
              borderColor: '#fff',
            }}
          />
        </View>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>АвтоДетали</Text>
          <Text style={styles.headerSubtitle}>🟢 В сети</Text>
        </View>
        <TouchableOpacity>
          <Text style={{ fontSize: 22 }}>☎️</Text>
        </TouchableOpacity>
      </View>

      {/* Product Preview */}
      <View style={styles.productPreview}>
        <View style={styles.productImage}>
          <Text style={{ fontSize: 20, textAlign: 'center', paddingTop: 8 }}>🔧</Text>
        </View>
        <View style={styles.productInfo}>
          <Text style={styles.productTitle}>Тормозные диски</Text>
          <Text style={styles.productPrice}>4 500 сом</Text>
        </View>
      </View>

      {/* Warning Box */}
      <View style={styles.warningBox}>
        <Text style={styles.warningText}>
          ⚠️ Не передавайте деньги до встречи. Проверьте товар перед оплатой!
        </Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Зарезервировать</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.actionButtonPrimary]}>
          <Text style={[styles.actionButtonText, styles.actionButtonTextPrimary]}>
            Встреча
          </Text>
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <ScrollView style={styles.messagesContainer} showsVerticalScrollIndicator={false}>
        {messages.map((msg) => (
          <View
            key={msg.id}
            style={[
              styles.messageBubble,
              msg.from === 'seller' ? styles.sellerMessage : styles.buyerMessage,
            ]}
          >
            <View
              style={[
                styles.messageBubbleContent,
                msg.from === 'seller' ? styles.sellerBubble : styles.buyerBubble,
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  { color: msg.from === 'seller' ? C.textPrimary : '#FFFFFF' },
                ]}
              >
                {msg.text}
              </Text>
              <Text
                style={[
                  styles.messageTime,
                  { color: msg.from === 'seller' ? C.textTertiary : 'rgba(255,255,255,0.8)' },
                ]}
              >
                {msg.time}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Message Input */}
      <View style={styles.inputContainer}>
        <View style={styles.inputField}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Введите сообщение..."
            placeholderTextColor={C.textTertiary}
            multiline
            maxLength={500}
            style={{ color: C.textPrimary, fontSize: 14 }}
          />
        </View>
        <TouchableOpacity style={styles.sendButton} onPress={send}>
          <Text style={{ fontSize: 18 }}>➤</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
