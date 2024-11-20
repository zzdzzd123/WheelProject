const canvas = document.getElementById('wheelCanvas');
const ctx = canvas.getContext('2d');
const pointer = document.getElementById('spinPointer');
const resultDisplay = document.getElementById('result');

// 转盘设置
const segments = ['奥莉娜', '天行', '星焰', '流火', '序列未来', '月影', '冰魄', '9转9', 'Ae86', '炽翼骁勇', '专属配件', '荣耀新生', '君之极影'];
const colors = ['#FF5733', '#FFC300', '#DAF7A6', '#33FFBD', '#3385FF', '#E91E63', '#FF6F61', '#6A5ACD', '#7FFFD4', '#FFD700', '#FF4500', '#98FB98', '#20B2AA'];
const segmentCount = segments.length;
let startAngle = 0; // 起始角度
let isSpinning = false; // 是否正在旋转

// 绘制转盘
function drawWheel() {
    const arc = Math.PI * 2 / segmentCount; // 每个扇形的角度
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    segments.forEach((segment, index) => {
        const angle = startAngle + index * arc;
        ctx.beginPath();
        ctx.arc(250, 250, 200, angle, angle + arc);
        ctx.lineTo(250, 250);
        ctx.fillStyle = colors[index];
        ctx.fill();
        ctx.save();

        // 添加文字
        ctx.translate(250 + Math.cos(angle + arc / 2) * 150, 250 + Math.sin(angle + arc / 2) * 150);
        ctx.rotate(angle + arc / 2 + Math.PI / 2);
        ctx.fillStyle = 'black';
        ctx.font = '14px Arial';
        ctx.fillText(segment, -ctx.measureText(segment).width / 2, 0);
        ctx.restore();
    });
}

// 开始旋转
function spinWheel() {
    if (isSpinning) return; // 如果正在旋转，直接返回
    isSpinning = true;

    const arc = Math.PI * 2 / segmentCount; // 每个扇形的角度
    const totalSpins = Math.floor(Math.random() * 5) + 5; // 随机旋转圈数
    const targetIndex = Math.floor(Math.random() * segmentCount); // 随机目标位置
    const targetAngle = targetIndex * arc + Math.PI * 2 * totalSpins; // 最终角度（目标分区角度 + 多圈旋转）
    const spinDuration = 4000; // 持续时间
    const startTime = Date.now();

    function animateSpin() {
        const elapsedTime = Date.now() - startTime;
        const progress = Math.min(elapsedTime / spinDuration, 1); // 进度值 0 到 1

        // 使用缓动公式（ease-out）实现减速
        const easing = 1 - Math.pow(1 - progress, 3);
        const currentAngle = easing * targetAngle;

        startAngle = currentAngle % (Math.PI * 2); // 更新起始角度
        drawWheel();

        if (progress < 1) {
            requestAnimationFrame(animateSpin);
        } else {
            isSpinning = false;

            // 修正最终停留的索引
            const adjustedAngle = Math.PI * 3 / 2 - startAngle; // 调整角度，0度为顶部
            const normalizedAngle = (adjustedAngle + Math.PI * 2) % (Math.PI * 2); // 保证角度为正
            const resultIndex = Math.floor(normalizedAngle / arc) % segmentCount; // 计算最终索引

            // 显示结果
            resultDisplay.textContent = `随机地图：${segments[resultIndex]}`;
        }
    }

    animateSpin();
}

drawWheel();

// 将点击事件绑定到指针
pointer.addEventListener('click', spinWheel);
