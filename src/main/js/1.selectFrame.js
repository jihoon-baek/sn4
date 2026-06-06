import state from './state';
import step2 from './2.capture';
import { makeButton } from './utils';
import { renderFrame } from './frameRenderer';

export default () => {
    step1();
}

const changeCut = (opt) => {
    if (opt == state.frameNum) return;
    const prev = document.getElementById('cut' + state.frameNum);
    if (prev) prev.innerHTML = prev.innerHTML.slice(2,)

    const curr = document.getElementById('cut' + opt);
    curr.innerHTML = '☑️ ' + curr.innerHTML;
    state.frameNum = opt;
}

const step1 = () => {
    let timerIntervalId;

    // selct frame
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
    msg.innerHTML = `<span>프레임을 선택해주세요</span><span id="timerText" style="font-size: 60px; color: #e74c3c; font-family: 'LOTTERIACHAB', sans-serif; min-width: 60px; text-shadow: 0 0 5px rgba(255,255,255,0.8);">60</span>`;
    document.body.appendChild(msg);

    // 60 seconds timer
    let timeLeft = 60;
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

    const cutMenu = document.createElement('div');
    cutMenu.id = 'cutMenu';
    cutMenu.style.position = 'absolute';
    cutMenu.style.display = 'flex';
    cutMenu.style.flexDirection = 'row';
    cutMenu.style.width = '1000px';
    cutMenu.style.height = '450px';
    cutMenu.style.top = 'calc(100px + (100vh - 230px) / 2)';
    cutMenu.style.left = '50%';
    cutMenu.style.transform = 'translate(-50%, -50%) scale(1)';
    cutMenu.style.transformOrigin = 'center center';
    cutMenu.style.marginLeft = '0';
    cutMenu.style.gap = '20px';
    cutMenu.style.padding = '10px';
    cutMenu.style.boxSizing = 'border-box';
    cutMenu.style.justifyContent = 'center';
    cutMenu.style.overflow = 'hidden';

    for (let i = 1; i <= 4; i += 1) {
        const cutContainer = document.createElement('div');
        cutContainer.style.display = 'flex';
        cutContainer.style.flexDirection = 'column';
        cutContainer.style.alignItems = 'center';
        cutContainer.style.flexShrink = '0';
        cutContainer.style.margin = '10px';

        const cut = document.createElement('div');
        cut.innerHTML = i != 4 ? (i + 1) + ' CUTS' : '4 CUTS';
        cut.className = 'cutMenu';
        cut.id = 'cut' + i;

        let frameW = 0;
        let frameH = 0;
        if (i == 1) { frameW = 1200; frameH = 1800; }
        else if (i == 2) { frameW = 1000; frameH = 1800; }
        else if (i == 3) { frameW = 1800; frameH = 1200; }
        else if (i == 4) { frameW = 600; frameH = 1800; }

        const maxW = 200;
        const maxH = 350;
        const scale = Math.min(maxW / frameW, maxH / frameH);

        const frameWrapper = document.createElement('div');
        frameWrapper.style.width = '200px';
        frameWrapper.style.height = '350px';
        frameWrapper.style.display = 'flex';
        frameWrapper.style.alignItems = 'center';
        frameWrapper.style.justifyContent = 'center';
        frameWrapper.style.margin = '20px auto';
        frameWrapper.style.cursor = 'pointer';

        // Render with background index 3 (pink beige)
        const frameDom = renderFrame(i, 3, scale);
        frameWrapper.appendChild(frameDom);

        cutContainer.appendChild(cut);
        cutContainer.appendChild(frameWrapper);
        cutContainer.addEventListener('click', () => { changeCut(i); });
        cutMenu.appendChild(cutContainer)
    }
    const nextBtn = makeButton('Next', () => {
        if (state.frameNum == 0) return;
        if (timerIntervalId) {
            clearInterval(timerIntervalId);
        }
        document.body.replaceChildren();
        step2();
    });

    // Create dropdown settings for capture interval in the bottom-left corner
    const settingsContainer = document.createElement('div');
    settingsContainer.style.position = 'absolute';
    settingsContainer.style.left = '40px';
    settingsContainer.style.bottom = '40px';
    settingsContainer.style.display = 'flex';
    settingsContainer.style.flexDirection = 'column';
    settingsContainer.style.gap = '8px';
    settingsContainer.style.zIndex = '100';

    const label = document.createElement('label');
    label.innerHTML = '⏱️ 촬영 간격 선택';
    label.style.fontFamily = 'NEXON Lv1 Gothic OTF';
    label.style.fontSize = '16px';
    label.style.color = '#5f4e4e';
    label.style.fontWeight = 'bold';

    const select = document.createElement('select');
    select.style.fontFamily = 'NEXON Lv1 Gothic OTF';
    select.style.fontSize = '18px';
    select.style.padding = '8px 16px';
    select.style.borderRadius = '10px';
    select.style.borderColor = '#ccc';
    select.style.backgroundColor = '#fff';
    select.style.cursor = 'pointer';
    select.style.color = '#5f4e4e';
    select.style.outline = 'none';

    const intervals = [1, 3, 5, 10, 15];
    intervals.forEach(sec => {
        const opt = document.createElement('option');
        opt.value = sec;
        opt.innerHTML = `${sec}초`;
        if (sec === state.captureInterval) {
            opt.selected = true;
        }
        select.appendChild(opt);
    });

    select.onchange = (e) => {
        state.captureInterval = parseInt(e.target.value);
    };

    settingsContainer.appendChild(label);
    settingsContainer.appendChild(select);
    document.body.appendChild(settingsContainer);

    document.body.appendChild(cutMenu);
    document.body.appendChild(nextBtn);

    // Responsive scaling script (ensures everything fits inside viewport without scrollbars)
    const fitLayout = () => {
        const wrapper = document.getElementById('cutMenu');
        if (!wrapper) {
            window.removeEventListener('resize', fitLayout);
            return;
        }
        const baseW = 1000;
        const baseH = 450;
        const winW = window.innerWidth - 40;
        const winH = window.innerHeight - 230; // height of viewport area

        const scale = Math.min(winW / baseW, winH / baseH, 1);
        wrapper.style.transform = `translate(-50%, -50%) scale(${scale})`;
    };

    window.addEventListener('resize', fitLayout);
    fitLayout(); // Trigger initial sizing
}