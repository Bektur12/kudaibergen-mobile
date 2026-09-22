import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Image,
  ActivityIndicator,
  Linking,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import {
  useAudioRecorder,
  useAudioRecorderState,
  useAudioPlayer,
  useAudioPlayerStatus,
  RecordingPresets,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
} from 'expo-audio';
import { C, BackBtn, Avatar } from '@/components/ui';
import { useAuth } from '@/context/auth';
import { ApiError } from '@/lib/api';
import {
  getChatMessages,
  sendTextMessage,
  sendMediaMessage,
  markChatRead,
  resolveMediaUrl,
  type ChatMessage,
} from '@/lib/chat-api';
import { subscribeToChat, subscribeToTyping, subscribeToPresence, sendTyping } from '@/lib/chat-socket';

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
    color: C.textTertiary,
    marginTop: 1,
  },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: C.success,
    borderWidth: 2,
    borderColor: C.surface,
  },
  centerFill: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingVertical: 8,
  },
  messageBubble: {
    marginVertical: 4,
    paddingHorizontal: 12,
  },
  otherMessage: {
    alignItems: 'flex-start',
  },
  ownMessage: {
    alignItems: 'flex-end',
  },
  messageBubbleContent: {
    maxWidth: '80%',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  otherBubble: {
    backgroundColor: C.surface,
  },
  ownBubble: {
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
  mediaImage: {
    width: 200,
    height: 200,
    borderRadius: 8,
    marginBottom: 4,
  },
  mediaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
  iconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButton: {
    backgroundColor: C.primary,
    borderRadius: 8,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  recordingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: C.error,
  },
});

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
}

function formatLastSeen(iso: string | null): string {
  if (!iso) return 'не в сети';
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return 'был(а) только что';
  if (minutes < 60) return `был(а) ${minutes} мин назад`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `был(а) ${hours} ч назад`;
  return `был(а) ${new Date(iso).toLocaleDateString('ru-RU')}`;
}

function formatDuration(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = Math.floor(totalSeconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

/** In-app play/pause for a voice message — separate component so its
 * player/hook only exists for the voice bubbles that actually need one. */
function VoiceBubbleContent({
  mediaUrl,
  durationSeconds,
  isOwn,
}: {
  mediaUrl: string | null;
  durationSeconds: number | null;
  isOwn: boolean;
}) {
  const player = useAudioPlayer(mediaUrl ?? undefined);
  const status = useAudioPlayerStatus(player);
  const textColor = isOwn ? '#FFFFFF' : C.textPrimary;

  const toggle = () => {
    if (!mediaUrl) return;
    if (status.playing) player.pause();
    else player.play();
  };

  const remaining = status.playing || status.currentTime > 0
    ? Math.max(0, (status.duration || durationSeconds || 0) - status.currentTime)
    : durationSeconds ?? status.duration ?? 0;

  return (
    <TouchableOpacity style={styles.mediaRow} onPress={toggle} disabled={!mediaUrl}>
      <Text style={{ fontSize: 20 }}>{status.playing ? '⏸️' : '🎤'}</Text>
      <Text style={[styles.messageText, { color: textColor }]}>
        Голосовое · {formatDuration(remaining)}
      </Text>
    </TouchableOpacity>
  );
}

function MessageBubble({ message, isOwn }: { message: ChatMessage; isOwn: boolean }) {
  const mediaUrl = resolveMediaUrl(message.mediaUrl);

  const content = () => {
    switch (message.type) {
      case 'PHOTO':
        return (
          <>
            {mediaUrl && (
              <TouchableOpacity onPress={() => mediaUrl && Linking.openURL(mediaUrl)}>
                <Image source={{ uri: mediaUrl }} style={styles.mediaImage} />
              </TouchableOpacity>
            )}
            {!!message.body && (
              <Text style={[styles.messageText, { color: isOwn ? '#FFFFFF' : C.textPrimary }]}>
                {message.body}
              </Text>
            )}
          </>
        );
      case 'VOICE':
        return (
          <VoiceBubbleContent
            mediaUrl={mediaUrl}
            durationSeconds={message.durationSeconds}
            isOwn={isOwn}
          />
        );
      case 'VIDEO':
        return (
          <TouchableOpacity
            style={styles.mediaRow}
            onPress={() => mediaUrl && Linking.openURL(mediaUrl)}
          >
            <Text style={{ fontSize: 20 }}>🎥</Text>
            <Text style={[styles.messageText, { color: isOwn ? '#FFFFFF' : C.textPrimary }]}>
              Видео
              {message.durationSeconds ? ` · ${message.durationSeconds}с` : ''}
            </Text>
          </TouchableOpacity>
        );
      case 'TEXT':
      default:
        return (
          <Text style={[styles.messageText, { color: isOwn ? '#FFFFFF' : C.textPrimary }]}>
            {message.body}
          </Text>
        );
    }
  };

  return (
    <View style={[styles.messageBubble, isOwn ? styles.ownMessage : styles.otherMessage]}>
      <View
        style={[styles.messageBubbleContent, isOwn ? styles.ownBubble : styles.otherBubble]}
      >
        {content()}
        <Text
          style={[
            styles.messageTime,
            { color: isOwn ? 'rgba(255,255,255,0.8)' : C.textTertiary },
          ]}
        >
          {formatTime(message.createdAt)}
        </Text>
      </View>
    </View>
  );
}

export default function ChatDetailScreen({
  chatId,
  chatName = 'Чат',
  initialOnline = false,
  initialLastSeenAt = null,
  onBack,
}: {
  chatId: number;
  chatName?: string;
  initialOnline?: boolean;
  initialLastSeenAt?: string | null;
  onBack?: () => void;
}) {
  const { user } = useAuth();
  const myId = user ? Number(user.id) : null;
  const insets = useSafeAreaInsets();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);

  const [online, setOnline] = useState(initialOnline);
  const [lastSeenAt, setLastSeenAt] = useState(initialLastSeenAt);
  const [otherTyping, setOtherTyping] = useState(false);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isTypingRef = useRef(false);

  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(recorder);

  // Single insertion point so every source (REST response, STOMP echo,
  // pagination) agrees on one rule: never add an id that's already there.
  // Without this, a message we just sent can double up if the STOMP echo
  // for it arrives before the REST call's own response resolves.
  const addMessage = useCallback((message: ChatMessage) => {
    setMessages((prev) => (prev.some((m) => m.id === message.id) ? prev : [message, ...prev]));
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await getChatMessages(chatId, 0);
        if (cancelled) return;
        setMessages(res.content);
        setHasMore(res.page < res.totalPages - 1);
        setPage(0);
        markChatRead(chatId).catch(() => {});
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [chatId]);

  // Live delivery over the shared STOMP socket (see chat-socket.ts) — REST
  // above only fetches history; this appends whatever arrives while the
  // screen is open. Dedupe by id: our own sends already land locally via
  // `send`/`attachPhoto`, and the broker echoes them back on this topic too.
  useEffect(() => {
    const unsubscribe = subscribeToChat(chatId, (message) => {
      addMessage(message);
      if (message.senderId !== myId) {
        markChatRead(chatId).catch(() => {});
      }
    });
    return unsubscribe;
  }, [chatId, myId, addMessage]);

  // Presence: server pushes the other side's online status whenever it
  // changes (initial value came in via route params from ChatSummary).
  useEffect(() => {
    const unsubscribe = subscribeToPresence(chatId, (event) => {
      if (event.userId === myId) return;
      setOnline(event.online);
      if (!event.online) setLastSeenAt(new Date().toISOString());
    });
    return unsubscribe;
  }, [chatId, myId]);

  // Typing: the other side pings typing:true/false. A local timeout self-heals
  // a missed "stopped typing" event (e.g. their app was killed mid-type).
  useEffect(() => {
    const unsubscribe = subscribeToTyping(chatId, (event) => {
      if (event.userId === myId) return;
      setOtherTyping(event.typing);
      if (event.typing) {
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => setOtherTyping(false), 5000);
      }
    });
    return () => {
      unsubscribe();
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, [chatId, myId]);

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore || loading) return;
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const res = await getChatMessages(chatId, nextPage);
      setMessages((prev) => {
        const existingIds = new Set(prev.map((m) => m.id));
        return [...prev, ...res.content.filter((m) => !existingIds.has(m.id))];
      });
      setPage(nextPage);
      setHasMore(nextPage < res.totalPages - 1);
    } finally {
      setLoadingMore(false);
    }
  }, [chatId, page, hasMore, loadingMore, loading]);

  const stopTypingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Pings /app/chats/{id}/typing at most once per burst of keystrokes — sends
  // `true` on the first character after being idle, then `false` once typing
  // pauses for 2s (or immediately after actually sending the message).
  const handleInputChange = (text: string) => {
    setInput(text);
    if (!isTypingRef.current) {
      isTypingRef.current = true;
      sendTyping(chatId, true);
    }
    if (stopTypingTimerRef.current) clearTimeout(stopTypingTimerRef.current);
    stopTypingTimerRef.current = setTimeout(() => {
      isTypingRef.current = false;
      sendTyping(chatId, false);
    }, 2000);
  };

  // If the screen unmounts mid-type (user backs out before the 2s idle
  // timeout fires), tell the other side we stopped — otherwise they'd see
  // "печатает..." for up to 5s after we've actually left the chat.
  useEffect(() => {
    return () => {
      if (stopTypingTimerRef.current) clearTimeout(stopTypingTimerRef.current);
      if (isTypingRef.current) {
        isTypingRef.current = false;
        sendTyping(chatId, false);
      }
    };
  }, [chatId]);

  const send = async () => {
    const body = input.trim();
    if (!body || sending) return;
    setSending(true);
    setInput('');
    if (stopTypingTimerRef.current) clearTimeout(stopTypingTimerRef.current);
    if (isTypingRef.current) {
      isTypingRef.current = false;
      sendTyping(chatId, false);
    }
    try {
      const message = await sendTextMessage(chatId, body);
      addMessage(message);
    } catch (err) {
      setInput(body);
      Alert.alert('Не удалось отправить', err instanceof ApiError ? err.message : 'Попробуйте ещё раз');
    } finally {
      setSending(false);
    }
  };

  // RN's `{ uri, name, type }` object is what FormData.append expects on
  // iOS/Android — but a real browser (web build) just stringifies a plain
  // object into a text field instead of attaching a file, so Spring never
  // sees a `file` part at all (MissingServletRequestPartException → the
  // backend's 500-instead-of-400 bug this was chasing). On web we have to
  // actually fetch the local blob/data URI and hand FormData a real File.
  const toFilePart = async (uri: string, name: string, type: string): Promise<Blob> => {
    if (Platform.OS === 'web') {
      const res = await fetch(uri);
      const blob = await res.blob();
      return new File([blob], name, { type });
    }
    return { uri, name, type } as unknown as Blob;
  };

  const attachPhoto = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Нужен доступ к галерее', 'Разрешите доступ к фото в настройках');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 0.8,
      });
      if (result.canceled || !result.assets[0]) return;

      const asset = result.assets[0];
      setSending(true);
      try {
        const form = new FormData();
        form.append(
          'file',
          await toFilePart(asset.uri, asset.fileName ?? 'photo.jpg', asset.mimeType ?? 'image/jpeg')
        );
        form.append('type', 'PHOTO');
        const message = await sendMediaMessage(chatId, form);
        addMessage(message);
      } catch (err) {
        // Show the real message for *any* error, not just ApiError — a plain
        // network/runtime failure here was getting hidden behind a generic
        // "попробуйте ещё раз" with no way to tell what actually went wrong.
        Alert.alert(
          'Не удалось отправить фото',
          err instanceof ApiError ? err.message : err instanceof Error ? err.message : 'Попробуйте ещё раз'
        );
      } finally {
        setSending(false);
      }
    } catch (err) {
      // Permission request or the picker itself threw — this was previously
      // uncaught, so the tap on 📎 just did nothing with zero visible error
      // and (per the backend log) no request ever left the device.
      Alert.alert('Не удалось выбрать фото', err instanceof Error ? err.message : 'Попробуйте ещё раз');
    }
  };

  const startRecording = async () => {
    try {
      const permission = await requestRecordingPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Нужен доступ к микрофону', 'Разрешите доступ к микрофону в настройках');
        return;
      }
      await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true });
      recorder.record();
    } catch (err) {
      // Most likely cause here: running in Expo Go, which doesn't ship the
      // native recording module — needs a dev build (eas build / expo run).
      Alert.alert(
        'Не удалось начать запись',
        err instanceof Error ? err.message : 'Голосовые сообщения требуют dev-сборку, не Expo Go'
      );
    }
  };

  const cancelRecording = async () => {
    try {
      if (recorderState.isRecording) await recorder.stop();
    } catch {
      // already stopped/never started — nothing to clean up
    }
  };

  const sendRecording = async () => {
    const durationSeconds = Math.round(recorderState.durationMillis / 1000);
    let uri: string | null = null;
    try {
      await recorder.stop();
      uri = recorder.uri;
    } catch (err) {
      Alert.alert('Не удалось остановить запись', err instanceof Error ? err.message : 'Попробуйте ещё раз');
      return;
    }
    if (!uri) return;

    setSending(true);
    try {
      const form = new FormData();
      form.append('file', await toFilePart(uri, 'voice.m4a', 'audio/m4a'));
      form.append('type', 'VOICE');
      form.append('durationSeconds', String(durationSeconds));
      const message = await sendMediaMessage(chatId, form);
      addMessage(message);
    } catch (err) {
      Alert.alert('Не удалось отправить голосовое', err instanceof ApiError ? err.message : 'Попробуйте ещё раз');
    } finally {
      setSending(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <BackBtn onBack={onBack} />
        <View>
          <Avatar initials={chatName.slice(0, 2).toUpperCase()} size={38} color={C.primary} />
          {online && <View style={styles.onlineDot} />}
        </View>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>{chatName}</Text>
          <Text style={styles.headerSubtitle}>
            {otherTyping ? 'печатает...' : online ? 'в сети' : formatLastSeen(lastSeenAt)}
          </Text>
        </View>
      </View>

      {loading ? (
        <View style={styles.centerFill}>
          <ActivityIndicator color={C.primary} />
        </View>
      ) : (
        <FlatList
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          data={messages}
          keyExtractor={(item) => item.id.toString()}
          inverted
          renderItem={({ item }) => (
            <MessageBubble message={item} isOwn={myId !== null && item.senderId === myId} />
          )}
          onEndReached={loadMore}
          onEndReachedThreshold={0.3}
          ListFooterComponent={loadingMore ? <ActivityIndicator style={{ margin: 12 }} /> : null}
        />
      )}

      {recorderState.isRecording ? (
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.iconButton} onPress={cancelRecording}>
            <Text style={{ fontSize: 20 }}>✕</Text>
          </TouchableOpacity>
          <View style={[styles.inputField, styles.recordingRow]}>
            <View style={styles.recordingDot} />
            <Text style={{ color: C.textPrimary, fontSize: 14 }}>
              Запись... {formatDuration(recorderState.durationMillis / 1000)}
            </Text>
          </View>
          <TouchableOpacity style={styles.sendButton} onPress={sendRecording} disabled={sending}>
            <Text style={{ fontSize: 18 }}>➤</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.iconButton} onPress={attachPhoto} disabled={sending}>
            <Text style={{ fontSize: 20 }}>📎</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={startRecording} disabled={sending}>
            <Text style={{ fontSize: 20 }}>🎤</Text>
          </TouchableOpacity>
          <View style={styles.inputField}>
            <TextInput
              value={input}
              onChangeText={handleInputChange}
              placeholder="Введите сообщение..."
              placeholderTextColor={C.textTertiary}
              multiline
              maxLength={2000}
              style={{ color: C.textPrimary, fontSize: 14 }}
            />
          </View>
          <TouchableOpacity style={styles.sendButton} onPress={send} disabled={sending}>
            <Text style={{ fontSize: 18 }}>➤</Text>
          </TouchableOpacity>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}
