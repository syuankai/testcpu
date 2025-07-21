// 收集裝置資訊
function collectDeviceInfo() {
const browserInfo = getBrowserInfo();
const osInfo = getOSInfo();
const screenInfo = `${window.screen.width}x${window.screen.height}`;
const cpuCores = navigator.hardwareConcurrency || '未知';
const memoryInfo = navigator.deviceMemory ? `${navigator.deviceMemory} GB` : '無法取得';
const performanceScore = calculatePerformanceScore();

document.getElementById('browser').textContent = browserInfo;
document.getElementById('os').textContent = osInfo;
document.getElementById('screen').textContent = screenInfo;
document.getElementById('cpu').textContent = cpuCores;
document.getElementById('memory').textContent = memoryInfo;
document.getElementById('performance').textContent = performanceScore.toFixed(2);
}

// 取得瀏覽器資訊
function getBrowserInfo() {
const ua = navigator.userAgent;
let browser = '未知';
if (ua.includes('Chrome')) browser = 'Google Chrome';
else if (ua.includes('Firefox')) browser = 'Mozilla Firefox';
else if (ua.includes('Safari')) browser = 'Apple Safari';
else if (ua.includes('Edge')) browser = 'Microsoft Edge';
return browser;
}

// 取得作業系統資訊
function getOSInfo() {
const ua = navigator.userAgent;
let os = '未知';
if (ua.includes('Win')) os = 'Windows';
else if (ua.includes('Mac')) os = 'macOS';
else if (ua.includes('Linux')) os = 'Linux';
else if (ua.includes('Android')) os = 'Android';
else if (ua.includes('iOS')) os = 'iOS';
return os;
}

// 模擬性能測試
function calculatePerformanceScore() {
const start = performance.now();
let sum = 0;
for (let i = 0; i < 1000000; i++) {
sum += Math.sqrt(i);
}
const end = performance.now();
return 1000 / (end - start);
}

// 與後端比較性能
async function comparePerformance() {
const performanceScore = parseFloat(document.getElementById('performance').textContent);
if (!performanceScore) {
document.getElementById('result-text').textContent = '請先取得裝置資訊！';
return;
}

const deviceInfo = {
browser: getBrowserInfo(),
os: getOSInfo(),
screen: `${window.screen.width}x${window.screen.height}`,
cpuCores: navigator.hardwareConcurrency || '未知',
memory: navigator.deviceMemory ? `${navigator.deviceMemory} GB` : '無法取得',
};

try {
const response = await fetch('https://your-worker-subdomain.workers.dev', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({
score: performanceScore,
deviceInfo: JSON.stringify(deviceInfo),
}),
});

const data = await response.json();
if (response.ok) {
document.getElementById('result-text').innerHTML = `
您的性能得分：${data.yourScore.toFixed(2)}<br>
平均性能得分：${data.averageScore}<br>
中位數得分：${data.medianScore}<br>
您的排名：前 ${data.percentile}%<br>
手機平均得分：${data.mobileAverage}<br>
桌面平均得分：${data.desktopAverage}<br>
總比較設備數：${data.totalDevices}<br>
${data.message}
`;
updateChart(data);
} else {
document.getElementById('result-text').textContent = `錯誤：${data.error}`;
}
} catch (error) {
document.getElementById('result-text').textContent = '比較失敗，請稍後再試。';
console.error('Error:', error);
}
}

// 更新圖表（直方圖）
function updateChart(data) {
const ctx = document.getElementById('performanceChart').getContext('2d');
const histogramData = Array(10).fill(0);
const minScore = 0;
const maxScore = 100;
const binSize = (maxScore - minScore) / 10;

// 模擬分佈數據（假設後端返回分數列表，實際應從 data.scores）
const scores = [data.yourScore, parseFloat(data.averageScore), parseFloat(data.medianScore)];
scores.forEach(score => {
const bin = Math.min(Math.floor((score - minScore) / binSize), 9);
histogramData[bin]++;
});

new Chart(ctx, {
type: 'bar',
data: {
labels: Array.from({ length: 10 }, (_, i) => `${(minScore + i * binSize).toFixed(0)}-${(minScore + (i + 1) * binSize).toFixed(0)}`),
datasets: [
{
label: '得分分佈',
data: histogramData,
backgroundColor: '#007bff',
borderColor: '#0056b3',
borderWidth: 1,
},
{
label: '您的得分',
data: histogramData.map((_, i) => (i === Math.floor((data.yourScore - minScore) / binSize) ? 1 : 0)),
backgroundColor: '#28a745',
borderColor: '#218838',
borderWidth: 1,
},
],
},
options: {
scales: {
y: { beginAtZero: true, title: { display: true, text: '設備數量' } },
x: { title: { display: true, text: '性能得分區間' } },
},
},
});
}

// 定時輪詢（每 30 秒重新比較）
function startPolling() {
setInterval(() => {
if (document.getElementById('performance').textContent) {
comparePerformance();
}
}, 30000); // 每 30 秒
}

// 初始化
window.onload = () => {
collectDeviceInfo();
startPolling();
};
  
