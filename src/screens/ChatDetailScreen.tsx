import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Linking,
  Alert,
  Animated,
  PanResponder,
  Modal,
  ScrollView,
  Pressable,
} from 'react-native';
import { Image } from 'expo-image';
import { StatusBar } from 'expo-status-bar';
import { VideoView, useVideoPlayer } from 'expo-video';
import { Mic, Send, Paperclip, Trash2, Play, Pause, X, Video as VideoIcon, ArrowLeft, Check, CheckCheck } from 'lucide-react-native';
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
import { C, Avatar } from '@/components/ui';
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

// WhatsApp palette (light theme).
const W = {
  header: '#008069',
  accent: '#00A884',
  wallpaper: '#EFEAE2',
  bubbleOwn: '#D9FDD3',
  bubbleOther: '#FFFFFF',
  text: '#111B21',
  meta: '#667781',
  tick: '#53BDEB',
  chip: '#FFFFFF',
  chipText: '#54656F',
  inputBg: '#FFFFFF',
  danger: '#EA0038',
};

const CANCEL_DX = 90;
const WAVE_BARS = 34;
const RECORDING_OPTIONS = { ...RecordingPresets.HIGH_QUALITY, isMeteringEnabled: true };

type MediaKind = 'PHOTO' | 'VOICE' | 'VIDEO';

// Mirrors the backend's upload limits (application.yml) — over these it answers 413 FILE_TOO_LARGE.
const MEDIA_LIMIT_MB: Record<MediaKind, number> = { PHOTO: 10, VOICE: 15, VIDEO: 100 };
const MEDIA_LIMIT_BYTES: Record<MediaKind, number> = {
  PHOTO: MEDIA_LIMIT_MB.PHOTO * 1024 * 1024,
  VOICE: MEDIA_LIMIT_MB.VOICE * 1024 * 1024,
  VIDEO: MEDIA_LIMIT_MB.VIDEO * 1024 * 1024,
};

function mediaErrorMessage(err: unknown, kind: MediaKind): string {
  if (err instanceof ApiError && (err.status === 413 || err.code === 'FILE_TOO_LARGE')) {
    return `Файл слишком большой — максимум ${MEDIA_LIMIT_MB[kind]} МБ`;
  }
  if (err instanceof Error) return err.message;
  return 'Попробуйте ещё раз';
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: W.wallpaper,
  },
  header: {
    backgroundColor: W.header,
    paddingHorizontal: 8,
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontWeight: '600',
    fontSize: 17,
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 1,
  },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: '#25D366',
    borderWidth: 2,
    borderColor: W.header,
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
    marginVertical: 1.5,
    paddingHorizontal: 10,
  },
  otherMessage: {
    alignItems: 'flex-start',
  },
  ownMessage: {
    alignItems: 'flex-end',
  },
  messageBubbleContent: {
    maxWidth: '82%',
    paddingHorizontal: 8,
    paddingTop: 6,
    paddingBottom: 4,
    borderRadius: 8,
    shadowColor: '#0B141A',
    shadowOpacity: 0.13,
    shadowRadius: 0.5,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  otherBubble: {
    backgroundColor: W.bubbleOther,
    borderTopLeftRadius: 0,
  },
  ownBubble: {
    backgroundColor: W.bubbleOwn,
    borderTopRightRadius: 0,
  },
  messageText: {
    fontSize: 15.5,
    lineHeight: 21,
    color: W.text,
  },
  messageTime: {
    fontSize: 11,
    color: W.meta,
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
    gap: 6,
    paddingHorizontal: 6,
    paddingTop: 6,
    alignItems: 'flex-end',
  },
  inputField: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: W.inputBg,
    borderRadius: 24,
    paddingLeft: 16,
    paddingRight: 4,
    minHeight: 48,
    maxHeight: 130,
  },
  iconButton: {
    width: 42,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButton: {
    backgroundColor: W.accent,
    borderRadius: 24,
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  recordingPill: {
    minHeight: 48,
    alignSelf: 'center',
    alignItems: 'center',
    paddingRight: 14,
  },
  recordingTime: {
    color: W.text,
    fontSize: 16,
    fontVariant: ['tabular-nums'],
  },
  recordingHint: {
    textAlign: 'right',
    color: W.meta,
    fontSize: 14,
  },
  micActive: {
    backgroundColor: W.danger,
  },
  voiceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minWidth: 200,
  },
  voicePlay: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 3,
    marginTop: 2,
  },
  dayChip: {
    alignSelf: 'center',
    backgroundColor: W.chip,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
    marginVertical: 8,
    shadowColor: '#0B141A',
    shadowOpacity: 0.13,
    shadowRadius: 0.5,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  dayChipText: {
    fontSize: 12.5,
    color: W.chipText,
  },
  voiceMeta: {
    flex: 1,
    gap: 3,
  },
  voiceTime: {
    fontSize: 11,
  },
  wave: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  imageWrap: {
    width: 220,
    height: 220,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: 'rgba(0,0,0,0.08)',
    marginBottom: 4,
  },
  imageFill: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  viewerBg: {
    flex: 1,
    backgroundColor: '#000',
  },
  viewerClose: {
    position: 'absolute',
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  recordingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: W.danger,
  },
});

function dayKey(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

function formatDay(iso: string): string {
  const d = new Date(iso);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  if (dayKey(iso) === dayKey(today.toISOString())) return 'Сегодня';
  if (dayKey(iso) === dayKey(yesterday.toISOString())) return 'Вчера';
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
}

const keyExtractor = (item: ChatMessage) => item.id.toString();

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

/** Deterministic "fake" waveform: the API doesn't return amplitude data, so
 * each voice message gets a stable bar pattern seeded by its id. */
function pseudoWave(seed: number): number[] {
  let x = (seed * 9301 + 49297) % 233280;
  const bars: number[] = [];
  let prev = 0.5;
  for (let i = 0; i < WAVE_BARS; i++) {
    x = (x * 9301 + 49297) % 233280;
    const r = x / 233280;
    prev = Math.min(1, Math.max(0.18, prev * 0.45 + r * 0.7));
    bars.push(prev);
  }
  return bars;
}

/** Reduces the recorded level history to `n` peak bars (max of each bucket), 2 decimals. */
function downsamplePeaks(levels: number[], n: number): number[] {
  if (levels.length < 4) return [];
  const out: number[] = [];
  for (let i = 0; i < n; i++) {
    const from = Math.floor((i * levels.length) / n);
    const to = Math.max(from + 1, Math.floor(((i + 1) * levels.length) / n));
    out.push(Math.round(Math.max(...levels.slice(from, to)) * 100) / 100);
  }
  return out;
}

const Waveform = memo(function Waveform({
  bars,
  progress = 0,
  activeColor,
  idleColor,
  height = 26,
}: {
  bars: number[];
  progress?: number;
  activeColor: string;
  idleColor: string;
  height?: number;
}) {
  return (
    <View style={[styles.wave, { height }]}>
      {bars.map((h, i) => (
        <View
          key={i}
          style={{
            width: 3,
            height: Math.max(3, h * height),
            borderRadius: 1.5,
            backgroundColor: (i + 0.5) / bars.length <= progress ? activeColor : idleColor,
          }}
        />
      ))}
    </View>
  );
});

/** Play/pause + waveform + timer. The native player is created empty and only
 * gets the URL on first tap: creating one per bubble up-front made every chat
 * open download/prepare every voice message in history (the main source of lag). */
function VoiceBubbleContent({
  messageId,
  mediaUrl,
  durationSeconds,
  waveform,
  isOwn,
}: {
  messageId: number;
  mediaUrl: string | null;
  durationSeconds: number | null;
  waveform?: number[] | null;
  isOwn: boolean;
}) {
  const player = useAudioPlayer(undefined);
  const status = useAudioPlayerStatus(player);
  const [requested, setRequested] = useState(false);
  const loadedUrlRef = useRef<string | null>(null);
  const bars = React.useMemo(
    () => (waveform && waveform.length > 3 ? waveform.map((v) => Math.min(1, Math.max(0.1, v))) : pseudoWave(messageId)),
    [waveform, messageId]
  );

  const fg = W.meta;
  const btnBg = 'transparent';
  const idle = isOwn ? 'rgba(17,27,33,0.28)' : 'rgba(17,27,33,0.22)';
  const active = W.accent;
  const textColor = W.meta;

  const total = status.duration || durationSeconds || 0;
  const progress = total > 0 ? Math.min(1, status.currentTime / total) : 0;
  const loading = requested && !status.isLoaded && !!mediaUrl;

  useEffect(() => {
    if (status.didJustFinish) player.seekTo(0);
  }, [status.didJustFinish, player]);

  const toggle = async () => {
    if (!mediaUrl) return;
    if (status.playing) {
      player.pause();
      return;
    }
    // Recording leaves the session in record mode (quiet earpiece on iOS).
    await setAudioModeAsync({ allowsRecording: false, playsInSilentMode: true }).catch(() => {});
    if (loadedUrlRef.current !== mediaUrl) {
      loadedUrlRef.current = mediaUrl;
      setRequested(true);
      player.replace(mediaUrl);
    }
    player.play();
  };

  const shown = status.playing || status.currentTime > 0 ? Math.max(0, total - status.currentTime) : total;

  return (
    <View style={styles.voiceRow}>
      <TouchableOpacity
        style={[styles.voicePlay, { backgroundColor: btnBg }]}
        onPress={toggle}
        disabled={!mediaUrl}
        activeOpacity={0.7}
      >
        {loading ? (
          <ActivityIndicator size="small" color={W.accent} />
        ) : status.playing ? (
          <Pause size={26} color={fg} fill={fg} />
        ) : (
          <Play size={26} color={fg} fill={fg} />
        )}
      </TouchableOpacity>
      <View style={styles.voiceMeta}>
        <Waveform bars={bars} progress={progress} activeColor={active} idleColor={idle} />
        <Text style={[styles.voiceTime, { color: textColor }]}>{formatDuration(shown)}</Text>
      </View>
    </View>
  );
}

/** Photo thumbnail: cached by message id (presigned URLs change every fetch),
 * with a spinner until it has loaded. */
function PhotoThumb({ uri, messageId, onOpen }: { uri: string; messageId: number; onOpen: (uri: string) => void }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <Pressable style={styles.imageWrap} onPress={() => onOpen(uri)}>
      <Image
        source={{ uri, cacheKey: `chat-media-${messageId}` }}
        style={styles.imageFill}
        contentFit="cover"
        transition={150}
        cachePolicy="memory-disk"
        recyclingKey={String(messageId)}
        onLoad={() => setLoaded(true)}
      />
      {!loaded && (
        <View style={[styles.imageOverlay, { backgroundColor: 'transparent' }]}>
          <ActivityIndicator color={C.primary} />
        </View>
      )}
    </Pressable>
  );
}

/** Full-screen in-app photo viewer (pinch-zoom on iOS) — replaces bouncing out to the browser. */
function ImageViewer({ uri, onClose }: { uri: string | null; onClose: () => void }) {
  const insets = useSafeAreaInsets();
  return (
    <Modal visible={!!uri} transparent={false} animationType="fade" onRequestClose={onClose} statusBarTranslucent>
      <View style={styles.viewerBg}>
        <TouchableOpacity style={[styles.viewerClose, { top: insets.top + 8 }]} onPress={onClose}>
          <X size={22} color="#FFFFFF" />
        </TouchableOpacity>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
          maximumZoomScale={4}
          minimumZoomScale={1}
          centerContent
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        >
          {uri && <Image source={{ uri }} style={{ width: '100%', height: '100%' }} contentFit="contain" />}
        </ScrollView>
      </View>
    </Modal>
  );
}

/** Full-screen in-app video player with native controls. */
function VideoViewer({ uri, onClose }: { uri: string | null; onClose: () => void }) {
  const insets = useSafeAreaInsets();
  const player = useVideoPlayer(uri, (p) => {
    p.play();
  });
  return (
    <Modal visible={!!uri} animationType="fade" onRequestClose={onClose} statusBarTranslucent>
      <View style={styles.viewerBg}>
        <TouchableOpacity style={[styles.viewerClose, { top: insets.top + 8 }]} onPress={onClose}>
          <X size={22} color="#FFFFFF" />
        </TouchableOpacity>
        {uri && <VideoView player={player} style={{ flex: 1 }} nativeControls contentFit="contain" />}
      </View>
    </Modal>
  );
}

type Pending = { kind: MediaKind; uri?: string; durationSeconds?: number };

/** Optimistic "uploading…" bubble shown at the bottom until the server answers. */
function PendingBubble({ pending }: { pending: Pending }) {
  const bars = React.useMemo(() => pseudoWave(pending.durationSeconds ?? 7), [pending.durationSeconds]);
  return (
    <View style={[styles.messageBubble, styles.ownMessage]}>
      <View style={[styles.messageBubbleContent, styles.ownBubble]}>
        {pending.kind === 'PHOTO' && pending.uri ? (
          <View style={styles.imageWrap}>
            <Image source={{ uri: pending.uri }} style={styles.imageFill} contentFit="cover" />
            <View style={styles.imageOverlay}>
              <ActivityIndicator color="#FFFFFF" />
            </View>
          </View>
        ) : pending.kind === 'VOICE' ? (
          <View style={styles.voiceRow}>
            <View style={styles.voicePlay}>
              <ActivityIndicator size="small" color={W.accent} />
            </View>
            <View style={styles.voiceMeta}>
              <Waveform bars={bars} activeColor={W.accent} idleColor="rgba(17,27,33,0.28)" />
              <Text style={[styles.voiceTime, { color: W.meta }]}>
                {formatDuration(pending.durationSeconds ?? 0)} · отправка…
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.mediaRow}>
            <ActivityIndicator size="small" color={W.accent} />
            <Text style={styles.messageText}>Видео загружается…</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const MessageBubble = memo(function MessageBubble({
  message,
  isOwn,
  onOpenImage,
  onOpenVideo,
  dayLabel,
}: {
  message: ChatMessage;
  isOwn: boolean;
  dayLabel: string | null;
  onOpenImage: (uri: string) => void;
  onOpenVideo: (uri: string) => void;
}) {
  const mediaUrl = resolveMediaUrl(message.mediaUrl);
  const textColor = W.text;

  const content = () => {
    switch (message.type) {
      case 'PHOTO':
        return (
          <>
            {mediaUrl && <PhotoThumb uri={mediaUrl} messageId={message.id} onOpen={onOpenImage} />}
            {!!message.body && <Text style={[styles.messageText, { color: textColor }]}>{message.body}</Text>}
          </>
        );
      case 'VOICE':
        return (
          <VoiceBubbleContent
            messageId={message.id}
            mediaUrl={mediaUrl}
            durationSeconds={message.durationSeconds}
            waveform={message.waveform}
            isOwn={isOwn}
          />
        );
      case 'VIDEO':
        return (
          <TouchableOpacity style={styles.mediaRow} onPress={() => mediaUrl && onOpenVideo(mediaUrl)}>
            <VideoIcon size={20} color={textColor} />
            <Text style={[styles.messageText, { color: textColor }]}>
              Видео
              {message.durationSeconds ? ` · ${message.durationSeconds}с` : ''}
            </Text>
          </TouchableOpacity>
        );
      case 'TEXT':
      default:
        return <Text style={[styles.messageText, { color: textColor }]}>{message.body}</Text>;
    }
  };

  return (
    <View>
      {dayLabel && (
        <View style={styles.dayChip}>
          <Text style={styles.dayChipText}>{dayLabel}</Text>
        </View>
      )}
      <View style={[styles.messageBubble, isOwn ? styles.ownMessage : styles.otherMessage]}>
        <View style={[styles.messageBubbleContent, isOwn ? styles.ownBubble : styles.otherBubble]}>
          {content()}
          <View style={styles.metaRow}>
            <Text style={styles.messageTime}>{formatTime(message.createdAt)}</Text>
            {isOwn &&
              (message.readAt ? (
                <CheckCheck size={16} color={W.tick} />
              ) : (
                <Check size={16} color={W.meta} />
              ))}
          </View>
        </View>
      </View>
    </View>
  );
});

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

  const recorder = useAudioRecorder(RECORDING_OPTIONS);
  const recorderState = useAudioRecorderState(recorder, 100);
  const [levels, setLevels] = useState<number[]>([]);
  const [pending, setPending] = useState<Pending | null>(null);
  const [viewerUri, setViewerUri] = useState<string | null>(null);
  const openImage = useCallback((uri: string) => setViewerUri(uri), []);
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const openVideo = useCallback((uri: string) => setVideoUri(uri), []);
  const fullLevelsRef = useRef<number[]>([]);
  const recordStartedAtRef = useRef(0);
  const startPromiseRef = useRef<Promise<boolean>>(Promise.resolve(false));
  const micDx = useRef(new Animated.Value(0)).current;
  const [willCancel, setWillCancel] = useState(false);

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
  // `send`/`attachMedia`, and the broker echoes them back on this topic too.
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

  // Live input level for the recording waveform (metering is in dB, ~-60 silence … 0 loud).
  useEffect(() => {
    if (!recorderState.isRecording) {
      setLevels((l) => (l.length ? [] : l));
      return;
    }
    const db = recorderState.metering ?? -60;
    const level = Math.min(1, Math.max(0.08, (db + 60) / 60));
    fullLevelsRef.current.push(level);
    setLevels((prev) => [...prev.slice(-(WAVE_BARS - 1)), level]);
  }, [recorderState.durationMillis]); // eslint-disable-line react-hooks/exhaustive-deps

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

  // Fetch the local picker/recorder URI into a real Blob — Expo SDK 57's
  // global fetch (expo/src/winter/fetch/convertFormData.ts) replaces RN's
  // and rejects the classic `{uri, name, type}` shorthand outright
  // ("Unsupported FormDataPart implementation").
  //
  // Deliberately NOT wrapping this in a `File`: RN's own `File` class
  // (Libraries/Blob/File.js) defines `.name` as a getter-only property on
  // its prototype. Expo's own `FormData.append` patch (winter/FormData.ts,
  // `normalizeArgs`) tries to tag a filename onto whatever you pass by doing
  // `value.name = ...` directly — which throws "Cannot assign to property
  // 'name' which has only a getter" against an RN File, but works fine
  // against a plain Blob (no such getter exists there). The filename goes
  // through `.append()`'s own third argument instead — the standard
  // `append(name, blob, filename)` form both Expo's patch and the web spec
  // already support, so this needs no platform branch at all.
  const toFilePart = async (uri: string, type: string): Promise<Blob> => {
    const res = await fetch(uri);
    const blob = await res.blob();
    return new Blob([blob], { type });
  };

  const attachMedia = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Нужен доступ к галерее', 'Разрешите доступ к фото и видео в настройках');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images', 'videos'],
        quality: 0.8,
      });
      if (result.canceled || !result.assets[0]) return;

      const asset = result.assets[0];
      const isVideo = asset.type === 'video';
      const kind = isVideo ? 'VIDEO' : 'PHOTO';
      const label = isVideo ? 'видео' : 'фото';

      // Fail fast on the client instead of uploading 100+ MB just to get a 413.
      if (asset.fileSize && asset.fileSize > MEDIA_LIMIT_BYTES[kind]) {
        Alert.alert('Файл слишком большой', `Максимальный размер ${label} — ${MEDIA_LIMIT_MB[kind]} МБ`);
        return;
      }

      setSending(true);
      setPending({ kind, uri: asset.uri });
      try {
        const form = new FormData();
        form.append(
          'file',
          await toFilePart(asset.uri, asset.mimeType ?? (isVideo ? 'video/mp4' : 'image/jpeg')),
          asset.fileName ?? (isVideo ? 'video.mp4' : 'photo.jpg')
        );
        form.append('type', kind);
        // expo-image-picker reports duration in milliseconds, the backend wants seconds.
        if (isVideo && asset.duration != null) {
          form.append('durationSeconds', String(Math.round(asset.duration / 1000)));
        }
        const message = await sendMediaMessage(chatId, form);
        addMessage(message);
      } catch (err) {
        // Show the real message for *any* error, not just ApiError — a plain
        // network/runtime failure here was getting hidden behind a generic
        // "попробуйте ещё раз" with no way to tell what actually went wrong.
        Alert.alert(`Не удалось отправить ${label}`, mediaErrorMessage(err, kind));
      } finally {
        setSending(false);
        setPending(null);
      }
    } catch (err) {
      // Permission request or the picker itself threw — this was previously
      // uncaught, so the tap on 📎 just did nothing with zero visible error
      // and (per the backend log) no request ever left the device.
      Alert.alert('Не удалось выбрать файл', err instanceof Error ? err.message : 'Попробуйте ещё раз');
    }
  };

  const startRecording = async (): Promise<boolean> => {
    try {
      const permission = await requestRecordingPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Нужен доступ к микрофону', 'Разрешите доступ к микрофону в настройках');
        return false;
      }
      await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true });
      await recorder.prepareToRecordAsync();
      recorder.record();
      recordStartedAtRef.current = Date.now();
      fullLevelsRef.current = [];
      return true;
    } catch (err) {
      // Most likely cause here: running in Expo Go, which doesn't ship the
      // native recording module — needs a dev build (eas build / expo run).
      Alert.alert(
        'Не удалось начать запись',
        err instanceof Error ? err.message : 'Голосовые сообщения требуют dev-сборку, не Expo Go'
      );
      return false;
    }
  };

  const cancelRecording = async () => {
    try {
      await recorder.stop();
    } catch {
      // already stopped/never started — nothing to clean up
    }
  };

  const sendRecording = async () => {
    const durationSeconds = Math.max(1, Math.round((Date.now() - recordStartedAtRef.current) / 1000));
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
    setPending({ kind: 'VOICE', durationSeconds });
    try {
      const form = new FormData();
      form.append('file', await toFilePart(uri, 'audio/mp4'), 'voice.m4a');
      form.append('type', 'VOICE');
      form.append('durationSeconds', String(durationSeconds));
      const peaks = downsamplePeaks(fullLevelsRef.current, WAVE_BARS);
      if (peaks.length) form.append('waveform', JSON.stringify(peaks));
      const message = await sendMediaMessage(chatId, form);
      addMessage(message);
    } catch (err) {
      Alert.alert('Не удалось отправить голосовое', mediaErrorMessage(err, 'VOICE'));
    } finally {
      setSending(false);
      setPending(null);
    }
  };

  // WhatsApp/Instagram-style hold-to-record: press and hold the mic, release to
  // send, slide left past CANCEL_DX (or release in <1s) to discard. The
  // PanResponder is created once, so it calls through a ref to always get the
  // handlers/state of the latest render.
  const renderItem = useCallback(
    ({ item, index }: { item: ChatMessage; index: number }) => {
      // Inverted list: the next index is the *older* message.
      const older = messages[index + 1];
      const dayLabel = !older || dayKey(older.createdAt) !== dayKey(item.createdAt) ? formatDay(item.createdAt) : null;
      return (
      <MessageBubble message={item} isOwn={myId !== null && item.senderId === myId}
        onOpenImage={openImage}
        onOpenVideo={openVideo}
        dayLabel={dayLabel}
      />
      );
    },
    [myId, openImage, openVideo, messages]
  );

  const holdRef = useRef({ startRecording, cancelRecording, sendRecording });
  holdRef.current = { startRecording, cancelRecording, sendRecording };

  const micPan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: () => {
        setWillCancel(false);
        startPromiseRef.current = holdRef.current.startRecording();
      },
      onPanResponderMove: (_, g) => {
        const dx = Math.min(0, g.dx);
        micDx.setValue(dx);
        setWillCancel(dx < -CANCEL_DX);
      },
      onPanResponderRelease: async (_, g) => {
        micDx.setValue(0);
        setWillCancel(false);
        const started = await startPromiseRef.current;
        if (!started) return;
        const heldMs = Date.now() - recordStartedAtRef.current;
        if (g.dx < -CANCEL_DX || heldMs < 1000) {
          await holdRef.current.cancelRecording();
        } else {
          await holdRef.current.sendRecording();
        }
      },
      onPanResponderTerminate: async () => {
        micDx.setValue(0);
        setWillCancel(false);
        if (await startPromiseRef.current) await holdRef.current.cancelRecording();
      },
    })
  ).current;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <StatusBar style="light" />
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity onPress={onBack} style={{ padding: 6 }} hitSlop={8}>
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View>
          <Avatar initials={chatName.slice(0, 2).toUpperCase()} size={40} color="#DFE5E7" />
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
          <ActivityIndicator color={W.accent} />
        </View>
      ) : (
        <FlatList
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          data={messages}
          keyExtractor={keyExtractor}
          inverted
          renderItem={renderItem}
          onEndReached={loadMore}
          onEndReachedThreshold={0.3}
          initialNumToRender={14}
          maxToRenderPerBatch={8}
          windowSize={7}
          removeClippedSubviews={Platform.OS === 'android'}
          keyboardShouldPersistTaps="handled"
          ListHeaderComponent={pending ? <PendingBubble pending={pending} /> : null}
          ListFooterComponent={loadingMore ? <ActivityIndicator style={{ margin: 12 }} /> : null}
        />
      )}

      <View style={[styles.inputContainer, { paddingBottom: Math.max(insets.bottom, 6) }]}>
        {recorderState.isRecording ? (
          <View style={[styles.inputField, styles.recordingRow, styles.recordingPill]}>
            {willCancel ? (
              <Trash2 size={20} color={W.danger} />
            ) : (
              <View style={styles.recordingDot} />
            )}
            <Text style={styles.recordingTime}>{formatDuration(recorderState.durationMillis / 1000)}</Text>
            <View style={{ flex: 1, alignItems: 'flex-end' }}>
              {willCancel ? (
                <Text style={[styles.recordingHint, { color: W.danger }]}>Отпустите — отмена</Text>
              ) : (
                <Waveform
                  bars={levels.length ? levels : [0.1]}
                  activeColor={W.meta}
                  idleColor={W.meta}
                  progress={1}
                  height={24}
                />
              )}
            </View>
            {!willCancel && <Text style={styles.recordingHint}>‹ Отмена</Text>}
          </View>
        ) : (
          <View style={styles.inputField}>
            <TextInput
              value={input}
              onChangeText={handleInputChange}
              placeholder="Сообщение"
              placeholderTextColor={W.meta}
              multiline
              maxLength={2000}
              style={{ flex: 1, color: W.text, fontSize: 17, paddingTop: 13, paddingBottom: 13, maxHeight: 130 }}
            />
            <TouchableOpacity style={styles.iconButton} onPress={attachMedia} disabled={sending}>
              <Paperclip size={22} color={W.meta} />
            </TouchableOpacity>
          </View>
        )}
        {input.trim().length > 0 && !recorderState.isRecording ? (
          <TouchableOpacity style={styles.sendButton} onPress={send} disabled={sending}>
            <Send size={21} color="#FFFFFF" />
          </TouchableOpacity>
        ) : (
          <Animated.View
            {...micPan.panHandlers}
            style={[
              styles.sendButton,
              recorderState.isRecording && styles.micActive,
              { transform: [{ translateX: micDx }, { scale: recorderState.isRecording ? 1.25 : 1 }] },
            ]}
          >
            <Mic size={22} color="#FFFFFF" />
          </Animated.View>
        )}
      </View>
      <ImageViewer uri={viewerUri} onClose={() => setViewerUri(null)} />
      <VideoViewer uri={videoUri} onClose={() => setVideoUri(null)} />
    </KeyboardAvoidingView>
  );
}
