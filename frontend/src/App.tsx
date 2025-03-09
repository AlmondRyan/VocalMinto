import { useState, useEffect, useRef } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Menu,
    MenuItem,
    Button,
    Box,
    Tabs,
    Tab,
    Divider,
    ThemeProvider,
    createTheme,
    LinearProgress,
    Paper,
    Stack,
    CircularProgress,
    Pagination,
    Card,
    CardContent,
    Grid,
} from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DetailsIcon from '@mui/icons-material/Details';
import SettingsIcon from '@mui/icons-material/Settings';
// 导入 WaveSurfer
import WaveSurfer from 'wavesurfer.js';

// 创建白色主题
const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#1976d2',
        },
        background: {
            default: '#ffffff',
            paper: '#ffffff',
        },
    },
});

// 日语音素页面数据
const japanesePhonemePages = [
    { name: "元音", phonemes: ["あ", "い", "う", "え", "お"] },
    { name: "か行", phonemes: ["か", "き", "く", "け", "こ"] },
    { name: "さ行", phonemes: ["さ", "し", "す", "せ", "そ"] },
    { name: "た行", phonemes: ["た", "ち", "つ", "て", "と"] },
    { name: "な行", phonemes: ["な", "に", "ぬ", "ね", "の"] },
    { name: "は行", phonemes: ["は", "ひ", "ふ", "へ", "ほ"] },
    { name: "ま行", phonemes: ["ま", "み", "む", "め", "も"] },
    { name: "や行", phonemes: ["や", "ゆ", "よ"] },
    { name: "ら行", phonemes: ["ら", "り", "る", "れ", "ろ"] },
    { name: "わ行", phonemes: ["わ", "を"] },
    { name: "ん", phonemes: ["ん"] },
    { name: "が行", phonemes: ["が", "ぎ", "ぐ", "げ", "ご"] },
    { name: "ざ行", phonemes: ["ざ", "じ", "ず", "ぜ", "ぞ"] },
    { name: "だ行", phonemes: ["だ", "ぢ", "づ", "で", "ど"] },
    { name: "ば行", phonemes: ["ば", "び", "ぶ", "べ", "ぼ"] },
    { name: "ぱ行", phonemes: ["ぱ", "ぴ", "ぷ", "ぺ", "ぽ"] },
];

function App() {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const [tabValue, setTabValue] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const waveformRef = useRef<HTMLDivElement>(null);
    const wavesurferRef = useRef<WaveSurfer | null>(null);

    // 添加完成状态数据 - 修改为0
    const completedCount = 0;
    const totalCount = 134;
    const completionPercentage = Math.round((completedCount / totalCount) * 100);

    // 初始化 WaveSurfer
    useEffect(() => {
        if (waveformRef.current && !wavesurferRef.current) {
            const wavesurfer = WaveSurfer.create({
                container: waveformRef.current,
                waveColor: '#4F76C7',
                progressColor: '#383351',
                cursorColor: '#383351',
                barWidth: 2,
                barRadius: 3,
                cursorWidth: 1,
                height: 80,
                barGap: 2,
            });

            wavesurferRef.current = wavesurfer;

            // 默认绘制一条空线
            wavesurfer.load('');
        }

        return () => {
            if (wavesurferRef.current) {
                wavesurferRef.current.destroy();
                wavesurferRef.current = null;
            }
        };
    }, []);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    }

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
        setCurrentPage(value);
    };

    // StatusBar 组件 - 修改文字颜色为黑色
    const StatusBar = () => (
        <Box
            sx={{
                borderTop: 1,
                borderColor: 'divider',
                p: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                bgcolor: theme.palette.grey[100],
                color: 'black', // 确保文字为黑色
            }}
        >
            <Typography variant="body2" color="black">
                Project Soundbank Language: Japanese
            </Typography>
            <Divider orientation="vertical" flexItem />
            <Typography variant="body2" color="black">
                Type: CV
            </Typography>
            <Divider orientation="vertical" flexItem />
            <Typography variant="body2" color="black">
                Progress: {completedCount}/134
            </Typography>
        </Box>
    );

    // 音素卡片组件 - 减小高度
    const PhonemeCard = ({ phoneme }: { phoneme: string }) => (
        <Card sx={{ minWidth: 100, m: 1 }}>
            <CardContent sx={{ py: 3 }}> {/* 减小上下内边距 */}
                <Typography variant="h5" component="div" align="center">
                    {phoneme}
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center">
                    未录制
                </Typography>
            </CardContent>
        </Card>
    );

    // Progress 组件
    const ProgressDisplay = () => (
        <Paper
            elevation={2}
            sx={{
                p: 3,
                borderRadius: 2,
                maxWidth: 400,
                width: '100%'
            }}
        >
            <Stack spacing={2} alignItems="center">
                <Box position="relative" display="inline-flex">
                    <CircularProgress
                        variant="determinate"
                        value={completionPercentage}
                        size={100}
                    />
                    <Box
                        sx={{
                            top: 0,
                            left: 0,
                            bottom: 0,
                            right: 0,
                            position: 'absolute',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Typography variant="caption" component="div" color="text.secondary">
                            {`${completionPercentage}%`}
                        </Typography>
                    </Box>
                </Box>
                <Typography variant="h6" component="div">
                    Completion Status
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {completedCount} of {totalCount} sounds completed
                </Typography>
            </Stack>
        </Paper>
    );

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', bgcolor: 'background.default' }}>
                {/* App Bar - 降低高度 */}
                <AppBar position="static" sx={{ boxShadow: 1 }}>
                    <Toolbar variant="dense">
                        <Button
                            color="inherit"
                            onClick={handleClick}
                            startIcon={<FolderIcon />}
                            sx={{ textTransform: 'none' }}
                        >
                            File
                        </Button>
                        <Menu
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                        >
                            <MenuItem onClick={handleClose}>New Project</MenuItem>
                            <MenuItem onClick={handleClose}>Open Project</MenuItem>
                            <MenuItem onClick={handleClose}>Save Project</MenuItem>
                            <MenuItem onClick={handleClose}>Save Project As</MenuItem>
                            <Divider />
                            <MenuItem onClick={handleClose}>Import Audio File</MenuItem>
                            <Divider />
                            <MenuItem onClick={handleClose}>Export Audio</MenuItem>
                            <Divider />
                            <MenuItem onClick={handleClose}>Exit</MenuItem>
                        </Menu>
                        <Box sx={{ flexGrow: 1 }} />
                    </Toolbar>
                </AppBar>

                {/* 主内容区域 */}
                <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
                    {/* 左侧垂直标签页 */}
                    <Tabs
                        orientation="vertical"
                        variant="scrollable"
                        value={tabValue}
                        onChange={handleTabChange}
                        sx={{
                            borderRight: 1,
                            borderColor: 'divider',
                            minWidth: '80px',
                            display: 'flex',
                            flexDirection: 'column',
                            height: '100%'
                        }}
                    >
                        <Tab icon={<DashboardIcon />} label="Overview" />
                        <Tab icon={<DetailsIcon />} label="Details" />
                        <Box sx={{ flexGrow: 1 }} />
                        <Tab icon={<SettingsIcon />} label="Settings" />
                    </Tabs>

                    {/* 标签页内容 */}
                    <Box sx={{
                        flexGrow: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%'
                    }}>
                        <Box sx={{ flexGrow: 1, p: 3, overflow: 'auto' }}>
                            {tabValue === 0 && (
                                <Box>
                                    <Typography variant="h4" gutterBottom>Overview</Typography>

                                    {/* 上半部分：状态和波形图 - 调整对齐方式 */}
                                    <Box sx={{ 
                                        display: 'flex', 
                                        flexWrap: 'wrap', 
                                        gap: 3, 
                                        mb: 4,
                                        alignItems: 'stretch' // 确保子元素高度一致
                                    }}>
                                        <Box sx={{ maxWidth: 400, width: '100%' }}>
                                            <ProgressDisplay />
                                        </Box>

                                        <Divider orientation="vertical" flexItem sx={{ mx: 10 }} />

                                        {/* 波形图 - 调整高度与 ProgressDisplay 一致 */}
                                        <Box sx={{ 
                                            flexGrow: 1, 
                                            minWidth: 300,
                                            display: 'flex',
                                            flexDirection: 'row',
                                            padding: -100
                                        }}>
                                            <Typography variant="h6" gutterBottom>
                                                Audio Waveform
                                            </Typography>
                                            <Paper
                                                elevation={2}
                                                sx={{
                                                    p: 2,
                                                    borderRadius: 2,
                                                    flexGrow: 1, // 填充剩余空间
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}
                                            >
                                                <Box
                                                    ref={waveformRef}
                                                    sx={{ width: '100%' }}
                                                />
                                            </Paper>
                                        </Box>
                                    </Box>

                                    {/* 中间分隔线 */}
                                    <Divider sx={{ mt: 10 }} />

                                    {/* 下半部分：音素卡片和分页 */}
                                    <Box sx={{ mt: 4 }}>
                                        <Typography variant="h6" gutterBottom align="center">
                                            {japanesePhonemePages[currentPage - 1]?.name || "音素"}
                                        </Typography>

                                        <Grid container justifyContent="center" spacing={1}> {/* 减小间距 */}
                                            {japanesePhonemePages[currentPage - 1]?.phonemes.map((phoneme, index) => (
                                                <Grid item key={index}>
                                                    <PhonemeCard phoneme={phoneme} />
                                                </Grid>
                                            ))}
                                        </Grid>

                                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}> {/* 减小上边距 */}
                                            <Pagination
                                                count={japanesePhonemePages.length}
                                                page={currentPage}
                                                onChange={handlePageChange}
                                                color="primary"
                                            />
                                        </Box>
                                    </Box>
                                </Box>
                            )}
                            {tabValue === 1 && (
                                <Box>
                                    <Typography variant="h4">Details</Typography>
                                    <Typography paragraph>
                                        Details content goes here.
                                    </Typography>
                                </Box>
                            )}
                            {tabValue === 2 && (
                                <Box>
                                    <Typography variant="h4">Settings</Typography>
                                    <Typography paragraph>
                                        Settings content goes here.
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                        {/* 在 Overview 和 Details 标签页显示 StatusBar */}
                        {(tabValue === 0 || tabValue === 1) && <StatusBar />}
                    </Box>
                </Box>
            </Box>
        </ThemeProvider>
    );
}

export default App;