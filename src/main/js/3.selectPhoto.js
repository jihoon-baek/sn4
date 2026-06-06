import state from './state'
import step4 from './4.selectDesign';
import { getCutNum, getImgSize, makeButton } from './utils';

export default () => {
    step3();
}

const step3 = () => {
    let timerIntervalId;

    const msg = document.createElement('div');
    msg.id = 'stageMsg';
    msg.style.position = 'absolute';
    msg.style.top = '30px';
    msg.style.left = '50%';
    msg.style.transform = 'translateX(-50%)';
    msg.style.display = 'flex';
    msg.style.alignItems = 'center';
    msg.style.justifyContent = 'center';
    msg.style.gap = '20px';
    msg.style.fontFamily = "'NEXON Lv1 Gothic OTF', sans-serif";
    msg.style.fontSize = '32px';
    msg.style.fontWeight = '700';
    msg.style.color = '#333';
    msg.style.zIndex = '10';
    msg.style.width = 'auto';
    msg.style.height = 'auto';
    msg.style.marginLeft = '0';
    msg.innerHTML = `<span>사진을 선택해주세요</span><span id="timerText" style="font-size: 60px; color: #e74c3c; font-family: 'LOTTERIACHAB', sans-serif; min-width: 60px; text-shadow: 0 0 5px rgba(255,255,255,0.8);">30</span>`;
    document.body.appendChild(msg);

    // 30 seconds timer
    let timeLeft = 30;
    const timerText = document.getElementById('timerText');
    timerIntervalId = setInterval(() => {
        timeLeft -= 1;
        if (timerText) {
            timerText.innerText = timeLeft;
        }
        if (timeLeft <= 0) {
            clearInterval(timerIntervalId);
            window.location.reload();
        }
    }, 1000);

    const imgContainer = document.createElement('div');
    imgContainer.id = 'imgContainer';
    imgContainer.style.display = 'grid';
    imgContainer.style.position = 'absolute';
    const { width, height } = getImgSize(state.frameNum);
    const imgW = width * 0.4;
    const imgH = height * 0.4;

    // Responsive container styling using fixed-aspect layout and scaling
    imgContainer.style.width = '1000px';
    imgContainer.style.height = '460px';
    imgContainer.style.top = 'calc(100px + (100vh - 200px) / 2)';
    imgContainer.style.left = '50%';
    imgContainer.style.transform = 'translate(-50%, -50%) scale(1)';
    imgContainer.style.transformOrigin = 'center center';
    imgContainer.style.gridTemplateColumns = 'repeat(4, 1fr)';
    imgContainer.style.gridTemplateRows = 'repeat(2, 1fr)';
    imgContainer.style.gap = '20px';
    imgContainer.style.boxSizing = 'border-box';
    imgContainer.style.overflow = 'hidden';

    state.dataURLs.forEach((url, idx) => {
        const img = new Image;
        img.src = url;
        img.id = 'img' + idx;
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.aspectRatio = `${imgW} / ${imgH}`;
        img.style.objectFit = 'cover';
        img.style.boxSizing = 'border-box';
        img.style.borderRadius = '10px';
        img.style.border = '4px solid rgb(249, 243, 243)';
        img.style.cursor = 'pointer';
        img.style.transition = 'all 0.15s ease-in-out';
        
        img.addEventListener('mouseenter', () => {
            if (!state.selectedIdx.has(idx)) {
                img.style.transform = 'scale(1.02)';
            }
        });
        img.addEventListener('mouseleave', () => {
            img.style.transform = 'scale(1)';
        });

        img.addEventListener('click', () => {selectPhotos(idx);})
        imgContainer.appendChild(img);
    })

    const nextBtn = makeButton('Next', () => {
        const cutNum = getCutNum(state.frameNum);
        if (state.selectedIdx.size != cutNum){
            window.alert('사진을 ' + cutNum + '장 선택하세요');
            return;
        }
        if (timerIntervalId) {
            clearInterval(timerIntervalId);
        }
        document.body.replaceChildren();
        step4();
    });
    nextBtn.style.bottom = '40px';
    nextBtn.style.right = '40px';

    document.body.appendChild(imgContainer);
    document.body.appendChild(nextBtn);

    // Responsive scaling script (ensures everything fits inside viewport without scrollbars)
    const fitLayout = () => {
        const wrapper = document.getElementById('imgContainer');
        if (!wrapper) {
            window.removeEventListener('resize', fitLayout);
            return;
        }
        const baseW = 1000;
        const baseH = 460;
        const winW = window.innerWidth - 40;
        const winH = window.innerHeight - 200; // height of viewport area between title and bottom area
        
        const scale = Math.min(winW / baseW, winH / baseH, 1);
        wrapper.style.transform = `translate(-50%, -50%) scale(${scale})`;
    };

    window.addEventListener('resize', fitLayout);
    fitLayout(); // Trigger initial sizing
}


const selectPhotos = (idx) => {
    if (state.selectedIdx.has(idx)) {
        state.selectedIdx.delete(idx);
        const img = document.querySelector('#img'+idx);
        img.style.border = '4px solid rgb(249, 243, 243)';
        img.style.boxShadow = 'none';
        img.style.transform = 'scale(1)';
    } else if (state.selectedIdx.size < getCutNum(state.frameNum)) {
        state.selectedIdx.add(idx);
        const img = document.querySelector('#img'+idx);
        img.style.border = '4px solid #da9090';
        img.style.boxShadow = '0 0 12px rgba(218, 144, 144, 0.6)';
        img.style.transform = 'scale(1.02)';
    }
}