  if (value < 1024 * 1024) return (value / 1024).toFixed(1) + ' KB';
  return (value / (1024 * 1024)).toFixed(1) + ' MB';
}

export function SettingsScreenView({ onNavigate }: { onNavigate: (screen: ScreenType) => void }) {
  const importRef = useRef<HTMLInputElement>(null);
  const [settings, setSettingsState] = usePersistentState<AppSettings>('phone:settings', DEFAULT_APP_SETTINGS);
  const [notice, setNotice] = useState('');
  const [openSection, setOpenSection] = useState<'ai' | 'voice' | 'image' | 'data' | 'background'>('ai');
  const [testing, setTesting] = useState(false);
  const [loadingModels, setLoadingModels] = useState(false);
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [heartbeat, setHeartbeat] = useState(() => getBackgroundHeartbeat());
  if (value < 1024 * 1024) return (value / 1024).toFixed(1) + ' KB';
  return (value / (1024 * 1024)).toFixed(1) + ' MB';
}

export function SettingsScreenView({ onNavigate }: { onNavigate: (screen: ScreenType) => void }) {
  const importRef = useRef<HTMLInputElement>(null);
  const [settings, setSettingsState] = usePersistentState<AppSettings>('phone:settings', DEFAULT_APP_SETTINGS);
  const [notice, setNotice] = useState('');
  const [openSection, setOpenSection] = useState<'ai' | 'voice' | 'image' | 'data' | 'background'>('ai');
  const [testing, setTesting] = useState(false);
  const [loadingModels, setLoadingModels] = useState(false);
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [heartbeat, setHeartbeat] = useState(() => getBackgroundHeartbeat());
  const [includeSecretsInBackup, setIncludeSecretsInBackup] = useState(false);
  const [backingUp, setBackingUp] = useState(false);

  const localStats = useMemo(() => {
    const data = collectLocalData();
    const size = new Blob([JSON.stringify(data)]).size;
    return { keys: Object.keys(data).length, size };